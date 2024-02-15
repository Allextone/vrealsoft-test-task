import {
  ApplicationException,
  ApplicationExceptionDataType,
} from '../application.exception';
import { HttpStatus } from '@nestjs/common';
import { MessageErrorCodeEnum } from '../enums/message-error-code.enum';

export const DATA_NOT_FOUND_EXCEPTION_NAME = 'data_not_found';

export class DataNotFoundException extends ApplicationException {
  constructor(public errorMassage: string) {
    super();
  }

  getStatus(): number {
    return HttpStatus.NOT_FOUND;
  }

  getCode(): string {
    return DATA_NOT_FOUND_EXCEPTION_NAME;
  }

  getMessageErrCode(): MessageErrorCodeEnum {
    return MessageErrorCodeEnum.DATA_NOT_FOUND;
  }

  getMessage(): string {
    return this.errorMassage;
  }

  getData(): ApplicationExceptionDataType {
    return {};
  }
}
