import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';

import { IncomingMessage, Server, ServerResponse } from 'http';

import { AppModule } from './app.module';
import { AppLogger } from './infrastructure/logger/logger';

async function bootstrap() {
  let httpsOptions;

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    httpsOptions,
  });
  const logger = new AppLogger('BootstrapService');
  const configService = await app.resolve<ConfigService>(ConfigService);
  const port = configService.get<number>('PORT');
  const url = `${configService.get<string>('BASE_URL')}:${port}`;
  const baseSubUrl = configService.get<string>('BASE_SUB_URL');
  const swaggerSubUrl = configService.get<string>('SWAGGER_SUB_URL');

  const timeout = configService.get<number>('SERVER_TIMEOUT_IN_SECONDS');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('ndev')
    .setDescription('REST API documentation of NEVIA')
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
bootstrap().catch(console.error);
