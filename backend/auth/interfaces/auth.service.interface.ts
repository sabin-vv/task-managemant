export interface AuthResult {
    token: string
    user: { id: string; name: string; email: string }
}

export interface IAuthService {
    register(name: string, email: string, password: string): Promise<AuthResult>
    login(email: string, password: string): Promise<AuthResult>
}
