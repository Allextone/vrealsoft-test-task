import {
  ApplicationException,
  ApplicationExceptionDataType,
} from '../application.exception';
import { HttpStatus } from '@nestjs/common';
import { MessageErrorCodeEnum } from '../enums/message-error-code.enum';

export const USER_DOES_NOT_EXIST_EXCEPTION_NAME = 'user_does_not_exist';

export class UserDoesNotExistException extends ApplicationException {
  constructor(public key: string, public value: string) {
    super();
  }

  getStatus(): number {
    return HttpStatus.NOT_FOUND;
  }

  getCode(): string {
    return USER_DOES_NOT_EXIST_EXCEPTION_NAME;
  }

  getMessageErrCode(): MessageErrorCodeEnum {
    return MessageErrorCodeEnum.USER_DOES_NOT_EXIST;
  }

  getMessage(): string {
    return `User with ${this.key} ${this.value} does not exist`;
  }

  getData(): ApplicationExceptionDataType {
    return {
      key: this.key,
      value: this.value,
    };
  }
}
