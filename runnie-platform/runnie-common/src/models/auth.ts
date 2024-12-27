import { Organization } from "./organization";

export interface AuthResponse {
    userId: number;
    fullName: string;
    email: string;
    role: string;
    avatar: string;
    organization: Organization;
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