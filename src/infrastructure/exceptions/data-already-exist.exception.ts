import {
  ApplicationException,
  ApplicationExceptionDataType,
} from '../application.exception';
import { HttpStatus } from '@nestjs/common';
import { MessageErrorCodeEnum } from '../enums/message-error-code.enum';

export const DATA_ALREADY_EXIST_EXCEPTION_NAME = 'data_already_exist';

export class DataAlreadyExistException extends ApplicationException {
  constructor(public errorMessage: string) {
    super();
  }

  getStatus(): number {
    return HttpStatus.FORBIDDEN;
  }

  getCode(): string {
    return DATA_ALREADY_EXIST_EXCEPTION_NAME;
  }

  getMessageErrCode(): MessageErrorCodeEnum {
    return MessageErrorCodeEnum.DATA_ALREADY_EXIST;
  }

  getMessage(): string {
    return this.errorMessage ? this.errorMessage : 'Data already exist';
  }

  getData(): ApplicationExceptionDataType {
    return {
      errorMessage: this.errorMessage,
    };
  }
}
