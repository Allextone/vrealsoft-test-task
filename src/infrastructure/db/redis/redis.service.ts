import Redis from 'ioredis';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { RedisKey } from 'ioredis/built/utils/RedisCommander';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
  private logger: Logger = new Logger(RedisService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async get(key: RedisKey) {
    this.logger.log(`Get key`);

    const result: string = await this.redis.get(key);

    if (result && result != 'NaN') {
      return JSON.parse(result);
    }

    return;
  }
  async add(key: RedisKey, value: string | Buffer | number, ttl?: number) {
    this.logger.log(`Add key`);

    return await this.redis.set(
      key,
      value,
      'EX',
      ttl
        ? ttl
        : Number(this.configService.get<number>('REDIS_TTL_IN_SECONDS')),
    );
  }

  async delete(key: RedisKey) {
    this.logger.log(`Delete key`);
    await this.redis.del(key);
  }
}
