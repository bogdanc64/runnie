import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { User } from 'runnie-common';

@Injectable()
export class EmailService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
    ) {}

    async sendVerificationEmail(user: User, verificationToken: string) {
        const frontendOrigin = this.configService.get<string>('FRONTEND_ORIGIN')
        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Verify your account',
            template: 'email-verification',
            context: {
                user: user.name,
                frontendOrigin,
                verificationToken,
            },
        });
    }

    async sendResetPasswordEmail(user: User, token: string) {
        const frontendOrigin = this.configService.get<string>('FRONTEND_ORIGIN')
        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Reset password',
            template: 'reset-password',
            context: {
                user: user.name,
                frontendOrigin,
                token,
            },
        });
    }

    async sendResetPasswordConfirmationEmail(user: User) {
        await this.mailerService.sendMail({
            to: user.email,
            subject: 'Reset password confirmation',
            template: 'reset-password-confirmation',
            context: {
                user: user.name
            },
        });
    }
}