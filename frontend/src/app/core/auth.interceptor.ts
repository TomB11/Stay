import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { API_BASE_URL } from './api.constant';
import { AuthService } from './auth.service';

const AUTH_PATH = `${API_BASE_URL}/auth/`;

function withToken(request: HttpRequest<unknown>, token: string | null): HttpRequest<unknown> {
  return token && request.url.startsWith(API_BASE_URL)
    ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : request;
}

/**
 * Attaches the access token to API calls. On 401 it renews the session once with the
 * refresh token and retries; if that is impossible it signs the user out.
 */
export const authInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const isAuthCall = request.url.startsWith(AUTH_PATH);

  return next(withToken(request, auth.token())).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 || isAuthCall) {
        return throwError(() => error);
      }
      if (!auth.canRefresh) {
        auth.clearSession();
        void router.navigate(['/login']);
        return throwError(() => error);
      }
      return auth.refresh().pipe(
        switchMap((session) => next(withToken(request, session.token))),
        catchError((refreshError: HttpErrorResponse) => {
          if (refreshError.status === 401 || refreshError.status === 400) {
            auth.clearSession();
            void router.navigate(['/login']);
          }
          return throwError(() => refreshError);
        }),
      );
    }),
  );
};
