import {
  ApplicationException,
  ApplicationExceptionDataType,
} from '../application.exception';
import { HttpStatus } from '@nestjs/common';
import { MessageErrorCodeEnum } from '../enums/message-error-code.enum';

export const INCORRECT_PASSWORD_EXCEPTION_NAME = 'incorrect_password';

export class IncorrectPasswordException extends ApplicationException {
  constructor() {
    super();
  }

  getStatus(): number {
    return HttpStatus.UNAUTHORIZED;
  }

  getCode(): string {
    return INCORRECT_PASSWORD_EXCEPTION_NAME;
  }

  getMessageErrCode(): MessageErrorCodeEnum {
    return MessageErrorCodeEnum.INCORRECT_PASSWORD;
  }

  getMessage(): string {
    return `Password is not correct`;
  }

  getData(): ApplicationExceptionDataType {
    return {};
  }
}
