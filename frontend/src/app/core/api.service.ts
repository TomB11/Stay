import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionRecord } from '../sessions/models/session-record.interface';
import { API_BASE_URL } from './api.constant';

/** Authorization headers are attached by the auth interceptor. */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  health() {
    return this.http.get<{ status: 'ok' }>(`${API_BASE_URL}/health`);
  }

  saveSession(session: Omit<SessionRecord, 'id' | 'createdAt'>) {
    return this.http.post<SessionRecord>(`${API_BASE_URL}/sessions`, session);
  }

  getSessions() {
    return this.http.get<SessionRecord[]>(`${API_BASE_URL}/sessions`);
  }
}
