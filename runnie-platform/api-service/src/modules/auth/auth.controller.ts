import { Body, Controller, Get, HttpCode, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponse, User, SignUpDTO } from 'runnie-common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { GoogleAuthGuard } from 'src/common/guards/google-auth.guard';
import { JwtRefreshAuthGuard } from 'src/common/guards/jwt-refresh-auth.guard';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';
import { Response } from 'express';
import { ResetPasswordDTO } from 'runnie-common/dist/src/models/auth';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}

  @Post('sign-in')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  async postSignIn(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response
  ): Promise<AuthResponse> {
    return this.authService.signIn(user, response);
  }

  @Post('sign-up')
  @HttpCode(200)
  postSignUp(@Body() body: SignUpDTO): Promise<User> {
    return this.authService.signUp(body);
  }

  @Post('refresh')
  @HttpCode(200)
  @UseGuards(JwtRefreshAuthGuard)
  async postRefreshTokens(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response
  ): Promise<AuthResponse> {
    return this.authService.signIn(user, response);
  }

  @Post('sign-out')
  @HttpCode(200)
  @UseGuards(JwtRefreshAuthGuard)
  postLogout(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.signOut(user, response);
  }

  @Post('verify-email')
  @HttpCode(200)
  postVerifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('request-reset-password')
  @HttpCode(200)
  postRequestResetPassword(@Body() body: { email: string }): Promise<boolean> {
    return this.authService.sendResetPasswordEmail(body.email);
  }

  @Patch('reset-password')
  patchResetPassword(@Body() body: ResetPasswordDTO): Promise<boolean> {
    return this.authService.resetPassword(body);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  loginGoogle() { /* Endpoint is empty because the redirect is handled by the strategy. */ }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(
    @Res() response: Response,
    @CurrentUser() user: User,
  ) {
    await this.authService.signIn(user, response, true);
  }
}
