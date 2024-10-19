import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import type { Response } from "express";

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
    constructor(private readonly configService: ConfigService) { 
        super() 
    }

    handleRequest<User>(
        err: Error | null,
        user: User | false,
        _info: never,
        context: ExecutionContext,
    ): User {
        const res: Response = context.switchToHttp().getResponse();

        if (err || !user) {
            res.redirect(302, this.configService.getOrThrow("FRONTEND_ORIGIN"));
            throw new UnauthorizedException();
        }

        return user;
    }
    
}
