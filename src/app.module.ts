import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { RedisModule } from '@liaoliaots/nestjs-redis';

import { migrations } from '../migrations';

import { RequestLoggingMiddleware } from './infrastructure/middlewares/logger.middlewares';
import { Filters } from './infrastructure/filters';

import { entities } from './infrastructure/db/postgres/entites';
import { RedisModule } from './infrastructure/db/redis/redis.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { LoggerGeneralModule } from './infrastructure/logger/logger.module';

import { MyCustomLogger } from './infrastructure/logger/typeorm-logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: parseInt(<string>configService.get('POSTGRES_PORT')),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities,
        migrations,
        synchronize: false,
        autoLoadEntities: true,
        logNotifications: true,
        logging: 'all',
        logger: new MyCustomLogger(),
      }),
    }),
    RedisModule,
    UsersModule,
    PostsModule,
    LoggerGeneralModule,
  ],
  controllers: [],
  providers: [...Filters],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
  private logger: Logger = new Logger(AppModule.name);

  onApplicationShutdown(signal?: string): any {
    this.logger.log(`Received signal ${signal}`, 'SIGNAL');
  }
}
