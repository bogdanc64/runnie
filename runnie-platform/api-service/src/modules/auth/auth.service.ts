import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthResponse, SignInDTO, SignUpDTO, User, UserStatus } from 'runnie-common';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './interfaces/token-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { TokenData } from './interfaces/token-data.interface';
import { Environments } from 'src/common/enums';
import { DateUtil } from 'src/common/utils/date.util';
import { EmailService } from 'src/common/services/email.service';
import * as argon from 'argon2';
import { v4 as uuid } from 'uuid';
import { ResetPasswordDTO } from 'runnie-common/dist/src/models/auth';
import { PermissionService } from '../permission/permission.service';
import { PermissionUtil } from 'src/common/utils/permission.util';
import { UserEntity } from 'src/database/entities/user.entity';

@Injectable()
export class AuthService {
  
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly permissionService: PermissionService,
  ) {}

  async signIn(user: User, response: Response, redirect = false): Promise<AuthResponse> {  
    // TODO: Check why after login, this endpoint is called again
    const authConfig = this.getAuthConfig();
    const tokenData = this.getTokenData(user.id);    

    const updateUserPayload = { 
      ...user,
      refreshToken: await argon.hash(tokenData.refreshToken) 
    } as Partial<UserEntity>;
    const updatedUser = await this.userService.upsert(updateUserPayload);

    response.cookie('Authentication', tokenData.accessToken, {
      httpOnly: true,
      secure: authConfig.environment === Environments.Production,
      expires: tokenData.expiresAccessToken,
    });
    response.cookie('Refresh', tokenData.refreshToken, {
      httpOnly: true,
      secure: authConfig.environment === Environments.Production,
      expires: tokenData.expiresRefreshToken,
    });

    if (redirect) {
      response.redirect(authConfig.frontendOrigin);
    }

    const authResponse = await this.createAuthResponse(updatedUser);
    return authResponse;
  }

  async signUp(body: SignUpDTO): Promise<UserEntity> {
    try {
      const existingUser = await this.userService.getByEmail(body.email);
      if (existingUser) throw new BadRequestException('User already exists');

      const hashedPassword = await argon.hash(body.password);
      const user = {
        name: body.name,
        email: body.email,
        passwordHash: hashedPassword,
        status: UserStatus.Pending,
        confirmEmailToken: uuid(),
        confirmEmailTokenDate: DateUtil.addDays(new Date(), 1)
      } as Partial<UserEntity>;

      const addedUser = await this.userService.upsert(user); 
      await this.emailService.sendVerificationEmail(addedUser, addedUser.confirmEmailToken);

      return addedUser;
    } catch (err) {
      console.error(`Failed to sign-up user - ${err}`)
      throw err;
    }
  }

  async signOut(user: User, response: Response): Promise<UserEntity> {
    try {
      response.clearCookie('Authentication');
      response.clearCookie('Refresh');

      const updatedUser = {
        ...user, 
        refreshToken: ""
      } as Partial<UserEntity>;

      return this.userService.upsert(updatedUser);
    } catch (err) {
      console.error(`Failed to sign-out user - ${err}`)
      throw err;
    }
  }

  async verifyEmail(token: string): Promise<boolean> {
    try {
      const existingUser = await this.userService.getByEmailToken(token);
      if (!existingUser || DateUtil.isAfter(new Date(), existingUser.confirmEmailTokenDate)) {
        throw new BadRequestException('Invalid token');
      }
      
      const user = {
        ...existingUser,
        confirmEmailToken: null,
        confirmEmailTokenDate: null,
        status: UserStatus.Active
      } as Partial<UserEntity>;
      
      await this.userService.upsert(user);
      
      return true;
    } catch (err) {
      console.error(`Failed to confirm email - ${err}`)
      throw err;
    }
  }

  async sendResetPasswordEmail(email: string): Promise<boolean> {
    try {
      const existingUser = await this.userService.getByEmail(email);
      if (!existingUser) {
        console.log(`No account found for email "${email}" while requesting a new password.`)
        return true; // Don't want to tell the user that there isn't any account with the provided email
      }
      
      const user = {
        ...existingUser,
        resetPasswordToken: uuid(),
        resetPasswordTokenDate: DateUtil.addDays(new Date(), 1)
      } as Partial<UserEntity>;

      const updatedUser = await this.userService.upsert(user); 
      await this.emailService.sendResetPasswordEmail(updatedUser, updatedUser.resetPasswordToken);

      return true;
    } catch (err) {
      console.error(`Failed to request reset password - ${err}`)
      throw err;
    }
  }

  async resetPassword(body: ResetPasswordDTO): Promise<boolean> {
    try {
      const existingUser = await this.userService.getByResetPassowrdToken(body.token);
      if (!existingUser || DateUtil.isAfter(new Date(), existingUser.resetPasswordTokenDate)) {
        throw new BadRequestException('Invalid token');
      }

      const hashedPassword = await argon.hash(body.password);
      const user = {
        ...existingUser,
        passwordHash: hashedPassword,
        resetPasswordToken: null,
        resetPasswordTokenDate: null
      } as Partial<UserEntity>;

      const updatedUser = await this.userService.upsert(user);
      await this.emailService.sendResetPasswordConfirmationEmail(updatedUser);

      return true;
    } catch (err) {
      console.error(`Failed to reset password - ${err}`)
      throw err;
    }
  }

  async verifyUserCredentials(body: SignInDTO): Promise<UserEntity> {
    try {
      const existingUser = await this.userService.getByEmail(body.email);
      if (!existingUser) throw new UnauthorizedException('Invalid credentials');

      if(!existingUser.passwordHash && existingUser.isOAuthUser) throw new BadRequestException('Invalid auth type.');
      
      const passwordMatches = await argon.verify(existingUser.passwordHash, body.password);
      if (!passwordMatches) throw new UnauthorizedException('Invalid credentials');
      
      return existingUser;
    } catch (err) {
      console.error(`Verify user credentials failed - ${err}`)
      throw err;
    }
  }

  async verifyUserRefreshToken(refreshToken: string, userId: number) {
    try {
      const user = await this.userService.findOne(userId);
      if (!user || user.refreshToken === "") throw new UnauthorizedException();

      const authenticated = await argon.verify(user.refreshToken, refreshToken);
      if (!authenticated) throw new UnauthorizedException();

      return user;
    } catch (err) {
      throw new UnauthorizedException('Refresh token is not valid.');
    }
  }

  private getAuthConfig() {
    return {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRATION'),
      refreshSecret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      refreshExpiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
      frontendOrigin: this.configService.get<string>('FRONTEND_ORIGIN'),
      environment: this.configService.get('NODE_ENV'),
    }
  }

  private getTokenData(userId: number): TokenData {
    const authConfig = this.getAuthConfig();

    const expiresAccessToken = new Date();
    expiresAccessToken.setTime(expiresAccessToken.getTime() + parseInt(authConfig.expiresIn));
    
    const expiresRefreshToken = new Date();
    expiresRefreshToken.setTime(expiresRefreshToken.getTime() + parseInt(authConfig.refreshExpiresIn));

    const tokenPayload: TokenPayload = { userId };

    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: authConfig.secret,
      expiresIn: `${authConfig.expiresIn}ms`,
    });
    
    const refreshToken = this.jwtService.sign(tokenPayload, {
      secret: authConfig.refreshSecret,
      expiresIn: `${authConfig.refreshExpiresIn}ms`,
    });

    return {
      accessToken,
      refreshToken,
      expiresAccessToken,
      expiresRefreshToken,
    }
  }

  private async createAuthResponse(user: User): Promise<AuthResponse> {
    const permissions = await this.permissionService.getPermissionsByRoleName(user.role);

    return {
      userId: user.id,
      fullName: user.name,
      email: user.email,
      role: user.role,
      avatar: user.photo,
      organization: user.organization,
      permissions: PermissionUtil.reducePermissionsByResource(permissions)
    }
  }
}
