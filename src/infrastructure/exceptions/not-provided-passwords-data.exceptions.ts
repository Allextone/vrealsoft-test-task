import {
  ApplicationException,
  ApplicationExceptionDataType,
} from '../application.exception';
import { HttpStatus } from '@nestjs/common';
import { MessageErrorCodeEnum } from '../enums/message-error-code.enum';

export const NOT_PROVIDED_PASSWORD_DATA_EXCEPTION_NAME =
  'not_provided_password_data';

export class NotProvidedPasswordDataException extends ApplicationException {
  constructor() {
    super();
  }

  getStatus(): number {
    return HttpStatus.BAD_REQUEST;
  }

  getCode(): string {
    return NOT_PROVIDED_PASSWORD_DATA_EXCEPTION_NAME;
  }

  getMessageErrCode(): MessageErrorCodeEnum {
    return MessageErrorCodeEnum.NOT_PROVIDED_PASSWORD_DATA;
  }

  getMessage(): string {
    return `Not provided new or old password.`;
  }

  getData(): ApplicationExceptionDataType {
    return {};
  }
}
