export interface AuthResult {
    user: { id: string; name: string; email: string }
    accessToken: string
}

export interface TokenResult {
    accessToken: string
}

export interface IAuthService {
    register(name: string, email: string, password: string): Promise<AuthResult>
    login(email: string, password: string): Promise<AuthResult>
    me(userId: string): Promise<AuthResult>
    refreshToken(userId: string): Promise<TokenResult>
}
