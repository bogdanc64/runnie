import { AuthResponse, ResetPasswordDTO, SignInDTO, SignUpDTO } from "../models/auth";
import { ContentTypes, HttpMethods, Response } from "../models/data";
import { DataService } from "./data.service";

export class AuthService {

    constructor(readonly dataService: DataService) {}

    public signIn(data: SignInDTO): Promise<Response<AuthResponse>> {
        return this.dataService.authMethod(
            "auth/sign-in",
            data,
            { contentType: ContentTypes.JSON, method: HttpMethods.POST }
        );
    }

    public async refreshAuthTokens(): Promise<Response<AuthResponse>> {
        return this.dataService.authMethod(
            "auth/refresh",
            { },
            { contentType: ContentTypes.JSON, method: HttpMethods.POST }
        );
    }

    public async signUp(data: SignUpDTO): Promise<Response<AuthResponse>> {
        return this.dataService.authMethod(
            "auth/sign-up",
            data,
            { contentType: ContentTypes.JSON, method: HttpMethods.POST }
        );
    }

    public async signOut() {
        return this.dataService.authMethod(
            "auth/sign-out",
            { },
            { contentType: ContentTypes.JSON, method: HttpMethods.POST }
        );
    }

    public async verifyEmail(token: string): Promise<Response<boolean>> {
        return this.dataService.authMethod(
            `auth/verify-email?token=${token}`,
            { },
            { contentType: ContentTypes.JSON, method: HttpMethods.POST }
        );
    }

    public async requestResetPassword(email: string): Promise<Response<boolean>> {
        return this.dataService.authMethod(
            `auth/request-reset-password`,
            { email },
            { contentType: ContentTypes.JSON, method: HttpMethods.POST }
        );
    }

    public async resetPassword(data: ResetPasswordDTO): Promise<Response<boolean>> {
        return this.dataService.authMethod(
            `auth/reset-password`,
            data,
            { contentType: ContentTypes.JSON, method: HttpMethods.PATCH }
        );
    }

    public async googleAuth() {
        window.location.href = `${this.dataService.apiUrl}auth/google`;
    }
}

