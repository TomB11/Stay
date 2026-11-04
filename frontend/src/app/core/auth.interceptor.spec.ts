import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { API_BASE_URL, AUTH_REFRESH_TOKEN_STORAGE_KEY, AUTH_TOKEN_STORAGE_KEY } from './api.constant';
import { AuthService } from './auth.service';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let http: HttpClient;
  let controller: HttpTestingController;
  let auth: AuthService;

  function setup(refreshToken: string | null): void {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, 'old');
    if (refreshToken) localStorage.setItem(AUTH_REFRESH_TOKEN_STORAGE_KEY, refreshToken);
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        provideRouter([]),
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
    auth = TestBed.inject(AuthService);
    spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
  }

  afterEach(() => localStorage.clear());

  it('renews the session on 401 and retries the request once', () => {
    setup('refresh-1');
    let result: unknown;
    http.get(`${API_BASE_URL}/sessions`).subscribe((value) => (result = value));

    controller.expectOne(`${API_BASE_URL}/sessions`).flush(null, { status: 401, statusText: 'Unauthorized' });
    controller
      .expectOne(`${API_BASE_URL}/auth/refresh`)
      .flush({ token: 'new', refreshToken: 'refresh-2', user: { id: '1', email: 'a@b.cz' } });
    const retry = controller.expectOne(`${API_BASE_URL}/sessions`);
    expect(retry.request.headers.get('Authorization')).toBe('Bearer new');
    retry.flush(['ok']);

    expect(result).toEqual(['ok']);
    expect(localStorage.getItem(AUTH_REFRESH_TOKEN_STORAGE_KEY)).toBe('refresh-2');
  });

  it('shares a single refresh between parallel 401 responses', () => {
    setup('refresh-1');
    http.get(`${API_BASE_URL}/a`).subscribe();
    http.get(`${API_BASE_URL}/b`).subscribe();

    controller.expectOne(`${API_BASE_URL}/a`).flush(null, { status: 401, statusText: 'Unauthorized' });
    controller.expectOne(`${API_BASE_URL}/b`).flush(null, { status: 401, statusText: 'Unauthorized' });
    controller
      .expectOne(`${API_BASE_URL}/auth/refresh`)
      .flush({ token: 'new', refreshToken: 'refresh-2', user: { id: '1', email: 'a@b.cz' } });
    controller.expectOne(`${API_BASE_URL}/a`).flush([]);
    controller.expectOne(`${API_BASE_URL}/b`).flush([]);
  });

  it('signs out when the refresh token is rejected', () => {
    setup('refresh-1');
    http.get(`${API_BASE_URL}/sessions`).subscribe({ error: () => undefined });

    controller.expectOne(`${API_BASE_URL}/sessions`).flush(null, { status: 401, statusText: 'Unauthorized' });
    controller.expectOne(`${API_BASE_URL}/auth/refresh`).flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(auth.isAuthenticated()).toBeFalse();
  });

  it('signs out immediately on 401 without a refresh token', () => {
    setup(null);
    http.get(`${API_BASE_URL}/sessions`).subscribe({ error: () => undefined });
    controller.expectOne(`${API_BASE_URL}/sessions`).flush(null, { status: 401, statusText: 'Unauthorized' });
    expect(auth.isAuthenticated()).toBeFalse();
  });
});
