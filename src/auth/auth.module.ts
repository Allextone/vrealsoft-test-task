import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
// import { RedisModule } from '@liaoliaots/nestjs-redis';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { RedisModule } from '../infrastructure/db/redis/redis.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    JwtModule.register({
      signOptions: {
        expiresIn: '1h',
      },
    }),
    forwardRef(() => UsersModule),
    RedisModule,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
