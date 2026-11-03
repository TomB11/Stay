import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { API_BASE_URL } from './api.constant';
import { NetworkActivityService } from './network-activity.service';

/** Reports pending API calls so the UI can warn about a slow (waking) server. */
export const networkActivityInterceptor: HttpInterceptorFn = (request, next) => {
  if (!request.url.startsWith(API_BASE_URL)) {
    return next(request);
  }
  const activity = inject(NetworkActivityService);
  activity.start();
  return next(request).pipe(finalize(() => activity.finish()));
};
