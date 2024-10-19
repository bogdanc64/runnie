export interface AuthResponse {
    user_id: number;
    fullName: string;
    email: string;
    role: string;
    avatar: string;
    permissions: { [key: string]: string[] };
}

export interface SignUpDTO {
    name: string;
    email: string;
    password: string;
}

export interface SignInDTO {
    email: string;
    password: string;
}

export interface ResetPasswordDTO {
    token: string;
    password: string;
}

export type TokenType = "Basic" | "Bearer";