import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { EmailService } from 'src/common/services/email.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { PermissionModule } from '../permission/permission.module';

@Module({
  imports: [
    UserModule,
    PermissionModule,
    PassportModule,
    JwtModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    GoogleStrategy,
    EmailService,
  ],
})
export class AuthModule {}
