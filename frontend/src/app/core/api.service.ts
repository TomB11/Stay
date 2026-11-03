import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SessionRecord } from '../sessions/models/session-record.interface';
import { DiaryEntry, NewDiaryEntry } from '../diary/models/diary-entry.interface';
import { ExposureAttempt, ExposureStep } from '../exposure/models/exposure-step.interface';
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

  getExposureSteps() {
    return this.http.get<ExposureStep[]>(`${API_BASE_URL}/exposure`);
  }

  addExposureStep(step: Pick<ExposureStep, 'title' | 'expectedAnxiety'>) {
    return this.http.post<ExposureStep>(`${API_BASE_URL}/exposure`, step);
  }

  addExposureAttempt(stepId: string, attempt: Pick<ExposureAttempt, 'anxietyBefore' | 'anxietyAfter'>) {
    return this.http.post<ExposureAttempt>(`${API_BASE_URL}/exposure/${stepId}/attempts`, attempt);
  }

  deleteExposureStep(stepId: string) {
    return this.http.delete<void>(`${API_BASE_URL}/exposure/${stepId}`);
  }

  getDiaryEntries() {
    return this.http.get<DiaryEntry[]>(`${API_BASE_URL}/diary`);
  }

  addDiaryEntry(entry: NewDiaryEntry) {
    return this.http.post<DiaryEntry>(`${API_BASE_URL}/diary`, entry);
  }

  deleteDiaryEntry(entryId: string) {
    return this.http.delete<void>(`${API_BASE_URL}/diary/${entryId}`);
  }
}
