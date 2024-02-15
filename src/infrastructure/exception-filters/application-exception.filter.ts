import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApplicationException } from '../application.exception';

@Catch(ApplicationException)
export class ApplicationExceptionFilter
  implements ExceptionFilter<ApplicationException>
{
  catch(exception: ApplicationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const body = {
      timestamp: new Date().toISOString(),
      path: request.url,
      code: exception.getCode(),
      message: exception.getMessage(),
      message_code: exception.getMessageErrCode(),
      data: exception.getData(),
    };

    response.status(status).json(body);
  }
}
