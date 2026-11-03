export interface AuthUser {
    id: string;
    email: string;
    passwordHash: string;
}
export interface AuthResponse {
    token: string;
    user: Pick<AuthUser, 'id' | 'email'>;
}
