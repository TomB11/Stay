import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import {
  API_BASE_URL,
  AUTH_EMAIL_STORAGE_KEY,
  AUTH_TOKEN_STORAGE_KEY,
} from './api.constant';
import { AccountExport } from './models/account-export.interface';
import { AuthResponse } from './models/auth-response.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/auth`;
  readonly token = signal(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY));
  readonly email = signal(localStorage.getItem(AUTH_EMAIL_STORAGE_KEY));
  readonly isAuthenticated = computed(() => Boolean(this.token()));

  /** Starts an authenticated account session and persists only its access token. */
  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/login`, { email, password })
      .pipe(tap((response) => this.storeSession(response)));
  }

  /** Creates an account and immediately signs the user in. */
  register(email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/register`, {
        email,
        password,
        consentAccepted: true,
        ageConfirmed: true,
      })
      .pipe(tap((response) => this.storeSession(response)));
  }

  /** Downloads every record the backend stores for the signed-in account. */
  exportData() {
    return this.http.get<AccountExport>(`${this.baseUrl}/export`);
  }

  /** Permanently deletes the account and signs the user out locally. */
  deleteAccount() {
    return this.http
      .delete<void>(`${this.baseUrl}/account`)
      .pipe(tap(() => this.logout()));
  }

  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    localStorage.removeItem(AUTH_EMAIL_STORAGE_KEY);
    this.token.set(null);
    this.email.set(null);
  }

  private storeSession(response: AuthResponse): void {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, response.token);
    localStorage.setItem(AUTH_EMAIL_STORAGE_KEY, response.user.email);
    this.token.set(response.token);
    this.email.set(response.user.email);
  }
}
