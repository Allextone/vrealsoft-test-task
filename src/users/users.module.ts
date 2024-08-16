import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from './users.controller';
import { Users } from './users.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([Users]), forwardRef(() => AuthModule)],
  exports: [UsersService],
})
export class UsersModule {}
