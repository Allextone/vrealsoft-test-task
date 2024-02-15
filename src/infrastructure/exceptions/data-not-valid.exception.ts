import {
  ApplicationException,
  ApplicationExceptionDataType,
} from '../application.exception';
import { HttpStatus } from '@nestjs/common';
import { MessageErrorCodeEnum } from '../enums/message-error-code.enum';

export const DATA_NOT_VALID_EXCEPTION_NAME = 'data_not_valid';

export class DataNotValidException extends ApplicationException {
  constructor(public errorMassage: string) {
    super();
  }

  getStatus(): number {
    return HttpStatus.BAD_REQUEST;
  }

  getCode(): string {
    return DATA_NOT_VALID_EXCEPTION_NAME;
  }

  getMessageErrCode(): MessageErrorCodeEnum {
    return MessageErrorCodeEnum.DATA_NOT_VALID;
  }

  getMessage(): string {
    return this.errorMassage;
  }

  getData(): ApplicationExceptionDataType {
    return {};
  }
}
