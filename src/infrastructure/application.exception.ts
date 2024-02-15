import { HttpStatus } from '@nestjs/common';
import { MessageErrorCodeEnum } from './enums/message-error-code.enum';

export type ApplicationExceptionDataType = { [key: string]: unknown };

export class ApplicationException extends Error {
  constructor() {
    super();
  }

  getStatus(): number {
    return HttpStatus.BAD_REQUEST;
  }

  getCode(): string {
    return 'application_exception';
  }

  getMessage(): string {
    return null;
  }

  getMessageErrCode(): MessageErrorCodeEnum {
    return MessageErrorCodeEnum.NOT_SET;
  }

  getData(): ApplicationExceptionDataType {
    return {};
  }
}
