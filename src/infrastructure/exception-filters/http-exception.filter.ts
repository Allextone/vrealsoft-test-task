import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const exceptionResponse = exception.getResponse();

    // if (exceptionResponse instanceof Object) {
    //   if ('statusCode' in exceptionResponse) {
    //     delete exceptionResponse['statusCode'];
    //   }
    //
    //   if ('message' in exceptionResponse) {
    //     delete exceptionResponse['message'];
    //   }
    //
    //   if ('error' in exceptionResponse) {
    //     delete exceptionResponse['error'];
    //   }
    // }

    const body = {
      timestamp: new Date().toISOString(),
      path: request.url,
      code: 'http_exception',
      message: exception.message,
      data: exceptionResponse,
    };
    console.log('body: ', body);
    response.status(status || HttpStatus.BAD_REQUEST).json(body);
  }
}
