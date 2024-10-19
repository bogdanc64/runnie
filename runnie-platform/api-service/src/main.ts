import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');
  const frontendOrigin = configService.get('FRONTEND_ORIGIN');
  
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: frontendOrigin,
    credentials: true
  });

  await app.listen(port);
}
bootstrap();
