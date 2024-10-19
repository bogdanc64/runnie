import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/modules/auth/auth.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import dbConfig from 'src/config/mikro-orm.config';
import { appConfig, emailConfig } from '../config/config';
import { UserModule } from 'src/modules/user/user.module';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig],
      isGlobal: true,
    }),
    MikroOrmModule.forRoot(dbConfig),
    MailerModule.forRoot(emailConfig),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
