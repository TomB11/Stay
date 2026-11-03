import { environment } from '../../environments/environment';

export const API_BASE_URL = environment.apiUrl;
export const AUTH_TOKEN_STORAGE_KEY = 'stay-auth-token';
export const AUTH_EMAIL_STORAGE_KEY = 'stay-auth-email';
export const SLOW_REQUEST_DELAY_MS = 4000;
export const MAX_SITUATION_LENGTH = 2000;
