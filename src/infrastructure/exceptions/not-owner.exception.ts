import {
  ApplicationException,
  ApplicationExceptionDataType,
} from '../application.exception';
import { HttpStatus } from '@nestjs/common';
import { MessageErrorCodeEnum } from '../enums/message-error-code.enum';

export const NOT_OWNER_EXCEPTION_NAME = 'not_owner';

export class NotOwnerException extends ApplicationException {
  constructor(public errorMassage: string) {
    super();
  }

  getStatus(): number {
    return HttpStatus.FORBIDDEN;
  }

  getCode(): string {
    return NOT_OWNER_EXCEPTION_NAME;
  }

  getMessageErrCode(): MessageErrorCodeEnum {
    return MessageErrorCodeEnum.FORBIDDEN_ACTION;
  }

  getMessage(): string {
    return this.errorMassage;
  }

  getData(): ApplicationExceptionDataType {
    return {};
  }
}
