export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 128;
export const MAX_EMAIL_LENGTH = 254;
export const MIN_REGISTRATION_AGE = 16;
export const TOKEN_LIFETIME_MS = 24 * 60 * 60 * 1000;
export const AUTH_THROTTLE = { limit: 10, ttl: 60_000 };
export const DEFAULT_THROTTLE = { limit: 120, ttl: 60_000 };
