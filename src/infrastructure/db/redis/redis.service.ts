import Redis from 'ioredis';
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { RedisKey } from 'ioredis/built/utils/RedisCommander';
import { ConfigService } from '@nestjs/config';
import { AppLogger } from '../../logger/logger';

@Injectable()
export class RedisService {
  private logger = new AppLogger('RedisService');
  constructor(
    private readonly configService: ConfigService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async get(key: RedisKey) {
    const result: string = await this.redis.get(key);

    if (result && result != 'NaN') {
      return JSON.parse(result);
    }

    return;
  }
  async add(key: RedisKey, value: string | Buffer | number, ttl?: number) {
    return await this.redis.set(
      key,
      value,
      'EX',
      ttl
        ? ttl
        : Number(this.configService.get<number>('REDIS_TTL_IN_SECONDS')),
    );
  }

  // async update() {
  //   await this.redis.set('key', 'value', 'EX', 10);
  // }

  async delete(key: RedisKey) {
    await this.redis.del(key);
  }
}
