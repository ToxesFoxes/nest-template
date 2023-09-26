//#region Core

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { INestApplication, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

//#endregion

import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import { BGgreen, BGred, cyan, reset } from './common/console/colors';
import { Swagger } from './common/docs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = app.get<ConfigService>(ConfigService);
  const NODE_ENV = config.get<string>('NODE_ENV', 'production')
  const PORT = config.get<number>('API_PORT', 5000);
  const PREFIX = config.get<string>('API_PREFIX', 'api')
  const APP_HOST_FULL = config.get<string>('API_HOST_FULL', 'http://localhost:5000')
  const logger = new Logger('NestBootstrap', { timestamp: true });

  app.setGlobalPrefix(PREFIX);
  app.use(cors());
  await Swagger.load(app, config);

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  await app.listen(PORT, () => {
    const isProduction = NODE_ENV === 'production' ? `🚧 ${BGred}PROD${reset}` : `⚒️  ${BGgreen}DEV!${reset}`
    logger.log(`${reset}${isProduction} on ${cyan}${APP_HOST_FULL}${reset} with prefix "${PREFIX}"`);
    Swagger.onLoad(config)
  });
}

bootstrap();
