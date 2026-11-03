import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module.js';
import { DatabaseService } from './../src/database/database.service.js';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  const consent = { consentAccepted: true, ageConfirmed: true };

  it('/api/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect({ status: 'ok' });
  });

  it('/api/auth/register and login (POST)', async () => {
    const credentials = {
      email: 'login@example.com',
      password: 'secure-password',
    };
    const registerResponse = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ ...credentials, ...consent })
      .expect(201);

    expect(registerResponse.body.token).toEqual(expect.any(String));
    expect(registerResponse.body.user.email).toBe(credentials.email);

    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send(credentials)
      .expect(201);

    expect(loginResponse.body.user.email).toBe(credentials.email);
    expect(loginResponse.body.token).toEqual(expect.any(String));
  });

  it('/api/sessions (POST, GET)', async () => {
    const authResponse = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'phase2@example.com', password: 'secure-password', ...consent })
      .expect(201);
    const authorization = `Bearer ${authResponse.body.token}`;
    const session = {
      phase: 'now',
      situation: 'A difficult moment',
      initialIntensity: 8,
      finalIntensity: 4,
      feedback: 'yes',
    };

    const createResponse = await request(app.getHttpServer())
      .post('/api/sessions')
      .set('Authorization', authorization)
      .send(session)
      .expect(201);

    expect(createResponse.body).toMatchObject(session);
    expect(createResponse.body.id).toEqual(expect.any(String));

    const listResponse = await request(app.getHttpServer())
      .get('/api/sessions')
      .set('Authorization', authorization)
      .expect(200);

    expect(listResponse.body).toEqual([createResponse.body]);
  });

  it('/api/sessions rejects missing token (GET)', () => {
    return request(app.getHttpServer()).get('/api/sessions').expect(401);
  });

  describe('validation', () => {
    const register = (email: string) =>
      request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email, password: 'secure-password', ...consent })
        .expect(201)
        .then((response) => `Bearer ${response.body.token}`);
    const validSession = {
      phase: 'now',
      situation: 'A difficult moment',
      initialIntensity: 8,
      finalIntensity: 4,
      feedback: 'yes',
    };

    it('rejects invalid credentials', async () => {
      const post = (body: object) =>
        request(app.getHttpServer()).post('/api/auth/register').send(body);
      await post({ email: 'not-an-email', password: 'secure-password', ...consent }).expect(400);
      await post({ email: 'short@example.com', password: 'short', ...consent }).expect(400);
      await post({ email: 'extra@example.com', password: 'secure-password', ...consent, role: 'admin' }).expect(400);
    });

    it.each([
      ['unknown phase', { phase: 'later' }],
      ['intensity above range', { initialIntensity: 11 }],
      ['negative intensity', { finalIntensity: -1 }],
      ['non-integer intensity', { initialIntensity: 2.5 }],
      ['too long situation', { situation: 'x'.repeat(2001) }],
      ['unknown feedback', { feedback: 'maybe' }],
    ])('rejects a session with %s', async (_name, override) => {
      const authorization = await register(`${_name.replace(/\s/g, '-')}@example.com`);
      await request(app.getHttpServer())
        .post('/api/sessions')
        .set('Authorization', authorization)
        .send({ ...validSession, ...override })
        .expect(400);
    });
  });

  it('stores only a hash of the access token', async () => {
    const { body } = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email: 'hash@example.com', password: 'secure-password', ...consent })
      .expect(201);
    const rows = await app
      .get(DatabaseService)
      .query<{ tokenHash: string }>('SELECT token_hash AS "tokenHash" FROM auth_tokens');

    expect(rows.length).toBe(1);
    expect(rows[0].tokenHash).not.toBe(body.token);
  });

  describe('account', () => {
    const register = () =>
      request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email: 'gdpr@example.com', password: 'secure-password', ...consent })
        .expect(201)
        .then((response) => response.body.token as string);

    it('requires consent and age confirmation', async () => {
      const post = (body: object) =>
        request(app.getHttpServer()).post('/api/auth/register').send(body);
      const base = { email: 'c@example.com', password: 'secure-password' };
      await post(base).expect(400);
      await post({ ...base, consentAccepted: true, ageConfirmed: false }).expect(400);
      await post({ ...base, consentAccepted: false, ageConfirmed: true }).expect(400);
    });

    it('exports and permanently deletes account data', async () => {
      const token = await register();
      const auth = { Authorization: `Bearer ${token}` };
      await request(app.getHttpServer())
        .post('/api/sessions')
        .set(auth)
        .send({
          phase: 'before',
          situation: 'Exam',
          initialIntensity: 7,
          finalIntensity: 4,
          feedback: 'yes',
        })
        .expect(201);

      const exported = await request(app.getHttpServer())
        .get('/api/auth/export')
        .set(auth)
        .expect(200);
      expect(exported.body.account.email).toBe('gdpr@example.com');
      expect(exported.body.account.consentAt).toEqual(expect.any(String));
      expect(exported.body.sessions).toHaveLength(1);

      await request(app.getHttpServer()).delete('/api/auth/account').set(auth).expect(204);
      await request(app.getHttpServer()).get('/api/sessions').set(auth).expect(401);
      const [counts] = await app
        .get(DatabaseService)
        .query<{ u: string; s: string }>('SELECT (SELECT COUNT(*) FROM users)::int AS u, (SELECT COUNT(*) FROM sessions)::int AS s');
      expect(counts).toEqual({ u: 0, s: 0 });
    });

    it('rejects export and deletion without a token', async () => {
      await request(app.getHttpServer()).get('/api/auth/export').expect(401);
      await request(app.getHttpServer()).delete('/api/auth/account').expect(401);
    });
  });

  describe('exposure ladder', () => {
    const registerUser = async (email: string) => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email, password: 'secure-password', ...consent })
        .expect(201);
      return { Authorization: ['Bearer', response.body.token].join(' ') };
    };

    it('requires authentication', async () => {
      await request(app.getHttpServer()).get('/api/exposure').expect(401);
    });

    it('creates ordered steps, records attempts, exports and cascades on delete', async () => {
      const auth = await registerUser('ladder@example.com');
      const hard = await request(app.getHttpServer())
        .post('/api/exposure')
        .set(auth)
        .send({ title: 'Present to the team', expectedAnxiety: 8 })
        .expect(201);
      await request(app.getHttpServer())
        .post('/api/exposure')
        .set(auth)
        .send({ title: 'Ask a question', expectedAnxiety: 3 })
        .expect(201);
      await request(app.getHttpServer())
        .post(`/api/exposure/${hard.body.id}/attempts`)
        .set(auth)
        .send({ anxietyBefore: 8, anxietyAfter: 5 })
        .expect(201);

      const list = await request(app.getHttpServer()).get('/api/exposure').set(auth).expect(200);
      expect(list.body.map((step: { title: string }) => step.title)).toEqual([
        'Ask a question',
        'Present to the team',
      ]);
      expect(list.body[1].attempts).toHaveLength(1);

      const exported = await request(app.getHttpServer())
        .get('/api/auth/export')
        .set(auth)
        .expect(200);
      expect(exported.body.exposureSteps).toHaveLength(2);
      expect(exported.body.exposureAttempts).toHaveLength(1);

      await request(app.getHttpServer()).delete('/api/auth/account').set(auth).expect(204);
      const [counts] = await app
        .get(DatabaseService)
        .query<{ s: number; a: number }>(
          'SELECT (SELECT COUNT(*) FROM exposure_steps)::int AS s, (SELECT COUNT(*) FROM exposure_attempts)::int AS a',
        );
      expect(counts).toEqual({ s: 0, a: 0 });
    });

    it('validates input and isolates users', async () => {
      const owner = await registerUser('owner@example.com');
      const other = await registerUser('other@example.com');
      await request(app.getHttpServer())
        .post('/api/exposure')
        .set(owner)
        .send({ title: '', expectedAnxiety: 3 })
        .expect(400);
      await request(app.getHttpServer())
        .post('/api/exposure')
        .set(owner)
        .send({ title: 'Step', expectedAnxiety: 11 })
        .expect(400);
      const step = await request(app.getHttpServer())
        .post('/api/exposure')
        .set(owner)
        .send({ title: 'Step', expectedAnxiety: 4 })
        .expect(201);

      await request(app.getHttpServer())
        .post(`/api/exposure/${step.body.id}/attempts`)
        .set(other)
        .send({ anxietyBefore: 4, anxietyAfter: 2 })
        .expect(404);
      await request(app.getHttpServer())
        .delete(`/api/exposure/${step.body.id}`)
        .set(other)
        .expect(404);
      await request(app.getHttpServer()).delete('/api/exposure/not-a-uuid').set(owner).expect(400);
      const otherList = await request(app.getHttpServer()).get('/api/exposure').set(other);
      expect(otherList.body).toEqual([]);

      await request(app.getHttpServer())
        .delete(`/api/exposure/${step.body.id}`)
        .set(owner)
        .expect(204);
    });
  });

  it('rate limits repeated authentication attempts', async () => {
    const attempt = () =>
      request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'nobody@example.com', password: 'secure-password' });
    for (let i = 0; i < 10; i++) {
      await attempt().expect(401);
    }
    await attempt().expect(429);
  });

  afterEach(async () => {
    await app.close();
  });
});
