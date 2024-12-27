import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/modules/user/user.service';
import { UserEntity } from 'src/database/entities/user.entity';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {

  constructor(
    configService: ConfigService,
    private readonly userService: UserService,
  ) {
    const protocol = configService.getOrThrow<boolean>('PROTOCOL');
    const fullHostname = `${protocol}://${configService.getOrThrow('API_HOSTNAME')}:${configService.getOrThrow('PORT')}`
    const callbackURL = `${fullHostname}/auth/google/callback`;

    super({
      clientID: configService.getOrThrow('GOOGLE_CLIENT_ID'),
      clientSecret: configService.getOrThrow('GOOGLE_SECRET'),
      callbackURL: callbackURL,
      scope: ['email', 'profile']
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: any): Promise<any> {
    return this.userService.upsert({
        email: profile.emails[0]?.value,
        name: `${profile.name.givenName} ${profile.name.familyName}`,
        photo: profile.photos[0]?.value,
        isOAuthUser: true,
    } as Partial<UserEntity>)
  }
}