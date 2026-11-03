import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_BASE_URL } from './api.constant';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let auth: AuthService;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    auth = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  it('exports data from the backend API', () => {
    auth.exportData().subscribe();
    http.expectOne(`${API_BASE_URL}/auth/export`).flush({});
  });

  it('deletes the account via the backend API and signs out', () => {
    auth.token.set('token');
    auth.deleteAccount().subscribe();
    http.expectOne(`${API_BASE_URL}/auth/account`).flush(null);
    expect(auth.isAuthenticated()).toBeFalse();
  });
});
