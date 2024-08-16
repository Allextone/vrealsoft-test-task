import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { PostsController } from './posts.controllet';
import { Posts } from './posts.entity';
import { PostsService } from './posts.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService],
  imports: [TypeOrmModule.forFeature([Posts]), forwardRef(() => AuthModule)],
  exports: [PostsService],
})
export class PostsModule {}
