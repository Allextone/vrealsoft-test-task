import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './exception-filters/http-exception.filter';
import { ApplicationExceptionFilter } from './exception-filters/application-exception.filter';

export const Filters = [
  {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter,
  },
  {
    provide: APP_FILTER,
    useClass: ApplicationExceptionFilter,
  },
];
