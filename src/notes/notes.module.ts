import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { NotesController } from './notes.controller';
import { NotesService } from './notes.service';
import { Notes } from './notes.entity';

@Module({
  controllers: [NotesController],
  providers: [NotesService],
  imports: [TypeOrmModule.forFeature([Notes]), forwardRef(() => AuthModule)],
  exports: [NotesService],
})
export class NotesModule {}
