import { Injectable, signal } from '@angular/core';
import { SLOW_REQUEST_DELAY_MS } from './api.constant';

/** Tracks pending API calls and flags when the server is slow to answer (e.g. a free-tier cold start). */
@Injectable({ providedIn: 'root' })
export class NetworkActivityService {
  readonly slow = signal(false);
  private pending = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;

  start(): void {
    this.pending++;
    if (this.pending === 1) {
      this.timer = setTimeout(() => this.slow.set(true), SLOW_REQUEST_DELAY_MS);
    }
  }

  finish(): void {
    this.pending = Math.max(0, this.pending - 1);
    if (this.pending === 0) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.slow.set(false);
    }
  }
}
