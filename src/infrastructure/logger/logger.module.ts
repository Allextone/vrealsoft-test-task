import { Module } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { ASYNC_STORAGE } from './logger.constants';
import { AppLogger } from './logger';

const asyncLocalStorage: AsyncLocalStorage<any> = new AsyncLocalStorage();

@Module({
  providers: [
    AppLogger,
    {
      provide: ASYNC_STORAGE,
      useValue: asyncLocalStorage,
    },
  ],
  exports: [AppLogger],
})
export class LoggerGeneralModule {}
