import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { RequestInterface } from '../interfaces/request.interface';

@Injectable()
export class RequestLoggingMiddleware
  implements NestMiddleware<Request, Response>
{
  private logger = new Logger('HTTP');

  private defaultTraceId = (req: RequestInterface) => {
    return req.traceId || req.header('X-Trace-Id') || randomUUID();
  };

  async use(req: RequestInterface, res: Response, next: NextFunction) {
    return await this.useLogger(req, res, next);
  }

  async useLogger(req: RequestInterface, res: Response, next: NextFunction) {
    const now = Date.now();

    const f = this.defaultTraceId;
    const traceId = f(req);

    res.setHeader('request-id', traceId);

    const { method, originalUrl: url } = req;
    const ip: string =
      req.header('x-client-ip') ?? req.header('x-real-ip') ?? req.ip;
    const contentType: string = req.header('content-type');
    const userAgent: string = req.header('user-agent');

    /**
     * format query params from object to string
     */
    const formattedQueryParams = (query: any) => {
      const queryKeys = Object.keys(query);
      if (!queryKeys.length) {
        return '';
      }

      const queryValues = Object.values(query);

      let condition = true;
      let result = '';
      for (let i = 0; condition; i++) {
        result =
          result +
          queryKeys[i] +
          ': ' +
          queryValues[i] +
          (queryKeys[i + 1] ? ', ' : '');

        if (!queryKeys[i + 1]) {
          condition = false;
          return result;
        }
      }
      return result;
    };
    const queryParams: string = '{' + formattedQueryParams(req.query) + '}';

    /**
     * format body params from object to string
     */
    const formattedBodyParams = (body: any) => {
      const bodyKeys = Object.keys(body);
      if (!bodyKeys.length) {
        return '';
      }

      const bodyValues = Object.values(body);

      let condition = true;
      let result = '';
      for (let i = 0; condition; i++) {
        result =
          result +
          bodyKeys[i] +
          ': ' +
          bodyValues[i] +
          (bodyKeys[i + 1] ? ', ' : '');

        if (!bodyKeys[i + 1]) {
          condition = false;
          return result;
        }
      }
      return result;
    };
    const bodyParams: string = '{' + formattedBodyParams(req.body) + '}';

    const formatedUrl: string =
      url.indexOf('?') > 0 ? url.slice(0, url.indexOf('?')) : url;

    this.logger.log(
      `${method} ${formatedUrl} ${queryParams} ${bodyParams} - ${userAgent} ${ip}, contentType: ${contentType}`,
    );

    res.on('finish', () => {
      const { statusCode } = res;
      // const contentLength = res.get('content-length');
      const timingInMs: number = Date.now() - now;
      const timingInS: number = timingInMs / 1000;

      this.logger.log(
        `${method} ${formatedUrl} - ${statusCode} - ${userAgent} ${ip} +${timingInS}s (${timingInMs}ms)`,
      );
    });

    next();
  }
}
