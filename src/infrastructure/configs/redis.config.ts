import { ConfigService } from '@nestjs/config';
import { RedisModuleOptions } from '@liaoliaots/nestjs-redis';

export const redisConfig = async (
  configService: ConfigService,
): Promise<RedisModuleOptions> => {
  return {
    closeClient: false,
    readyLog: true,
    errorLog: true,
    config: {
      // host: configService.get('REDIS_HOST'),
      // port: configService.get('REDIS_PORT'),
      host: configService.get<string>('REDIS_HOST'),
      port: Number(configService.get<number>('REDIS_PORT')),
    },
  };
};
