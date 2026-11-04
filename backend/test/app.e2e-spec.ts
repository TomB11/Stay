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

  describe('refresh tokens', () => {
    const credentials = { email: 'refresh@example.com', password: 'secure-password' };
    const registerUser = () =>
      request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ ...credentials, ...consent })
        .expect(201);

    it('rotates the refresh token and issues a working access token', async () => {
      const first = (await registerUser()).body;
      const refreshed = await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken: first.refreshToken })
        .expect(200);

      expect(refreshed.body.refreshToken).not.toBe(first.refreshToken);
      await request(app.getHttpServer())
        .get('/api/sessions')
        .set('Authorization', `Bearer ${refreshed.body.token}`)
        .expect(200);
      await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken: first.refreshToken })
        .expect(401);
    });

    it('rejects an unknown refresh token', () =>
      request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken: 'nope' })
        .expect(401));

    it('revokes the refresh token on logout', async () => {
      const { refreshToken } = (await registerUser()).body;
      await request(app.getHttpServer())
        .post('/api/auth/logout')
        .send({ refreshToken })
        .expect(204);
      await request(app.getHttpServer())
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(401);
    });
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

  describe('anxiety diary', () => {
    const entry = {
      situation: 'Meeting with the manager',
      thought: 'I will say something stupid',
      emotion: 'fear',
      intensityBefore: 8,
      alternativeThought: 'I prepared and can ask for clarification',
      intensityAfter: 5,
    };
    const registerUser = async (email: string) => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email, password: 'secure-password', ...consent })
        .expect(201);
      return { Authorization: ['Bearer', response.body.token].join(' ') };
    };

    it('requires authentication', async () => {
      await request(app.getHttpServer()).get('/api/diary').expect(401);
    });

    it('stores, lists, exports and cascades entries on account delete', async () => {
      const auth = await registerUser('diary@example.com');
      await request(app.getHttpServer()).post('/api/diary').set(auth).send(entry).expect(201);
      const list = await request(app.getHttpServer()).get('/api/diary').set(auth).expect(200);
      expect(list.body).toHaveLength(1);
      expect(list.body[0]).toMatchObject(entry);

      const exported = await request(app.getHttpServer())
        .get('/api/auth/export')
        .set(auth)
        .expect(200);
      expect(exported.body.diaryEntries).toHaveLength(1);

      await request(app.getHttpServer()).delete('/api/auth/account').set(auth).expect(204);
      const [counts] = await app
        .get(DatabaseService)
        .query<{ d: number }>('SELECT COUNT(*)::int AS d FROM diary_entries');
      expect(counts.d).toBe(0);
    });

    it('validates input and isolates users', async () => {
      const owner = await registerUser('diary-owner@example.com');
      const other = await registerUser('diary-other@example.com');
      await request(app.getHttpServer())
        .post('/api/diary')
        .set(owner)
        .send({ ...entry, thought: '' })
        .expect(400);
      await request(app.getHttpServer())
        .post('/api/diary')
        .set(owner)
        .send({ ...entry, intensityAfter: 11 })
        .expect(400);
      const created = await request(app.getHttpServer())
        .post('/api/diary')
        .set(owner)
        .send(entry)
        .expect(201);

      const otherList = await request(app.getHttpServer()).get('/api/diary').set(other);
      expect(otherList.body).toEqual([]);
      await request(app.getHttpServer())
        .delete(`/api/diary/${created.body.id}`)
        .set(other)
        .expect(404);
      await request(app.getHttpServer())
        .delete(`/api/diary/${created.body.id}`)
        .set(owner)
        .expect(204);
    });
  });

  describe('rewards', () => {
    const registerUser = async (email: string) => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email, password: 'secure-password', ...consent })
        .expect(201);
      return { Authorization: ['Bearer', response.body.token].join(' ') };
    };
    const diaryEntry = {
      situation: 's',
      thought: 't',
      emotion: 'fear',
      intensityBefore: 6,
      alternativeThought: 'a',
      intensityAfter: 4,
    };

    it('requires authentication', async () => {
      await request(app.getHttpServer()).get('/api/rewards').expect(401);
    });

    it('earns a gift after five actions and hides wrapped titles', async () => {
      const auth = await registerUser('rewards@example.com');
      const server = app.getHttpServer();
      await request(server).post('/api/rewards').set(auth).send({ title: 'Coffee' }).expect(201);
      await request(server).post('/api/rewards').set(auth).send({ title: 'Cinema' }).expect(201);
      await request(server).post('/api/rewards/open').set(auth).expect(400);
      for (let i = 0; i < 5; i += 1) {
        await request(server).post('/api/diary').set(auth).send(diaryEntry).expect(201);
      }
      const before = await request(server).get('/api/rewards').set(auth).expect(200);
      expect(before.body.giftsAvailable).toBe(1);
      expect(before.body.rewards.every((r: { title: unknown }) => r.title === null)).toBe(true);

      const opened = await request(server).post('/api/rewards/open').set(auth).expect(200);
      expect(['Coffee', 'Cinema']).toContain(opened.body.title);
      await request(server).post('/api/rewards/open').set(auth).expect(400);
      await request(server).post(`/api/rewards/${opened.body.id}/redeem`).set(auth).expect(204);

      const after = await request(server).get('/api/rewards').set(auth).expect(200);
      expect(after.body.giftsAvailable).toBe(0);
      const redeemed = after.body.rewards.find((r: { id: string }) => r.id === opened.body.id);
      expect(redeemed.title).toBe(opened.body.title);
      expect(redeemed.redeemedAt).not.toBeNull();
      expect(after.body.actionsToday.diaryEntries).toBe(5);
      expect(after.body.ladder).toEqual({ attempts: 0, masteredSteps: 0, highestMasteredAnxiety: 0 });
      const future = new Date(Date.now() + 86_400_000).toISOString();
      const tomorrow = await request(server)
        .get('/api/rewards')
        .query({ since: future })
        .set(auth)
        .expect(200);
      expect(tomorrow.body.actionsToday.diaryEntries).toBe(0);
      await request(server).get('/api/rewards').query({ since: 'nope' }).set(auth).expect(400);
    });

    it('does not let another user touch a reward', async () => {
      const owner = await registerUser('reward-owner@example.com');
      const other = await registerUser('reward-other@example.com');
      const server = app.getHttpServer();
      const created = await request(server)
        .post('/api/rewards')
        .set(owner)
        .send({ title: 'Trip' })
        .expect(201);
      await request(server).delete(`/api/rewards/${created.body.id}`).set(other).expect(404);
      await request(server).delete(`/api/rewards/${created.body.id}`).set(owner).expect(204);
    });
  });

  describe('insights', () => {
    it('requires authentication', async () => {
      await request(app.getHttpServer()).get('/api/insights').expect(401);
    });

    it('summarises the account data', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email: 'insights@example.com', password: 'secure-password', ...consent })
        .expect(201);
      const auth = { Authorization: ['Bearer', response.body.token].join(' ') };

      const empty = await request(app.getHttpServer()).get('/api/insights').set(auth).expect(200);
      expect(empty.body.totalRecords).toBe(0);
      expect(empty.body.exposure).toEqual({ totalSteps: 0, masteredSteps: 0 });

      await request(app.getHttpServer())
        .post('/api/sessions')
        .set(auth)
        .send({ phase: 'now', situation: 'x', initialIntensity: 8, finalIntensity: 4, feedback: 'yes' })
        .expect(201);
      const step = await request(app.getHttpServer())
        .post('/api/exposure')
        .set(auth)
        .send({ title: 'Step', expectedAnxiety: 4 })
        .expect(201);
      await request(app.getHttpServer())
        .post(`/api/exposure/${step.body.id}/attempts`)
        .set(auth)
        .send({ anxietyBefore: 6, anxietyAfter: 2 })
        .expect(201);

      const insights = await request(app.getHttpServer()).get('/api/insights').set(auth).expect(200);
      expect(insights.body.totalRecords).toBe(1);
      expect(insights.body.sessionReduction).toEqual({ count: 1, average: 4 });
      expect(insights.body.helpfulRate).toBe(100);
      expect(insights.body.exposure).toEqual({ totalSteps: 1, masteredSteps: 1 });
      expect(insights.body.streakDays).toBe(1);
      expect(insights.body.suggestProfessionalHelp).toBeNull();
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
