import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { randomUUID } from 'crypto';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

import { AppLogger } from './infrastructure/logger/logger';
import { ASYNC_STORAGE } from './infrastructure/logger/logger.constants';

const logger: Logger = new Logger('Bootstrap | Main');

async function bootstrap() {
  let httpsOptions;

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions,
  });
  const configService = await app.resolve<ConfigService>(ConfigService);
  const port = configService.get<number>('PORT');
  const url = `${configService.get<string>('BASE_URL')}:${port}`;
  const baseSubUrl = configService.get<string>('BASE_SUB_URL');
  const swaggerSubUrl = configService.get<string>('SWAGGER_SUB_URL');
  const timeout = configService.get<number>('SERVER_TIMEOUT_IN_SECONDS');

  app.use((req, res, next) => {
    const asyncStorage = app.get(ASYNC_STORAGE);
    const traceId: string = req.headers['x-request-id'] || randomUUID();
    const store = new Map().set('traceId', traceId);
    asyncStorage.run(store, () => {
      next();
    });
  });
  app.useLogger(app.get(AppLogger));
  // app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('ndev')
    .setDescription('REST API documentation of VrealSoft')
    .setVersion('1.0.0')
    .addServer(`${url}/${baseSubUrl}`)
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${baseSubUrl}/${swaggerSubUrl}`, app, swaggerDocument, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const server: Server = <
    Server<typeof IncomingMessage, typeof ServerResponse>
  >await app.listen(port, () => {
    logger.log(`Server started at url ${url}/${baseSubUrl}`);
    logger.log(
      `Swagger documentation stared at url ${url}/${baseSubUrl}/${swaggerSubUrl}`,
    );
  });

  server.setTimeout(timeout * 1000);
}
bootstrap().catch((err) => logger.error(err, 'EXCEPTION'));
