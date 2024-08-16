import {
  ApplicationException,
  ApplicationExceptionDataType,
} from '../application.exception';
import { HttpStatus } from '@nestjs/common';
import { MessageErrorCodeEnum } from '../enums/message-error-code.enum';

export const NOT_ALLOWED_USER_ID_EXCEPTION_NAME = 'not_allowed_user_id';

export class NotAllowedUserIdException extends ApplicationException {
  constructor(public errorMassage?: string) {
    super();
  }

  getStatus(): number {
    return HttpStatus.FORBIDDEN;
  }

  getCode(): string {
    return NOT_ALLOWED_USER_ID_EXCEPTION_NAME;
  }

  getMessageErrCode(): MessageErrorCodeEnum {
    return MessageErrorCodeEnum.NOT_ALLOWED_USER_ID;
  }

  getMessage(): string {
    const message: string =
      this.errorMassage || 'User not allowed to do this action';
    return message;
  }

  getData(): ApplicationExceptionDataType {
    return {};
  }
}
