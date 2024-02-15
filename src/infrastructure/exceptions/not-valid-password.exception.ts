import {
  ApplicationException,
  ApplicationExceptionDataType,
} from '../application.exception';
import { HttpStatus } from '@nestjs/common';
import { MessageErrorCodeEnum } from '../enums/message-error-code.enum';

export const NOT_VALID_PASSWORD_EXCEPTION_NAME = 'not_valid_password';

export class NotValidPasswordException extends ApplicationException {
  constructor(public errorMessage: string) {
    super();
  }

  getStatus(): number {
    return HttpStatus.BAD_REQUEST;
  }

  getCode(): string {
    return NOT_VALID_PASSWORD_EXCEPTION_NAME;
  }

  getMessageErrCode(): MessageErrorCodeEnum {
    return MessageErrorCodeEnum.NOT_VALID_PASSWORD;
  }

  getMessage(): string {
    return this.errorMessage;
  }

  getData(): ApplicationExceptionDataType {
    return {
      errorMessage: this.errorMessage,
    };
  }
}
