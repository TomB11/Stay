export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: { id: string; email: string };
}
