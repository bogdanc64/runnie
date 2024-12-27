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
import { AssetModule } from 'src/modules/asset/asset.module';
import { OrganizationModule } from 'src/modules/organization/organization.module';
import { PermissionModule } from 'src/modules/permission/permission.module';
import { RoleModule } from 'src/modules/role/role.module';

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
    AssetModule,
    OrganizationModule,
    RoleModule,
    PermissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
