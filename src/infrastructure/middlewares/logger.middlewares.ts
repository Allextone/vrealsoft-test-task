import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { v4 } from 'uuid';

@Injectable()
export class RequestLoggingMiddleware
  implements NestMiddleware<Request, Response>
{
  private logger = new Logger('HTTP');

  async use(req: Request, res: Response, next: NextFunction) {
    return await this.useLogger(req, res, next);
  }
  async useLogger(req: Request, res: Response, next: NextFunction) {
    const now = Date.now();

    const traceId = (req['traceId'] = v4());
    res.setHeader('request-id', traceId);

    const { method, originalUrl: url } = req;
    const ip = req.header('x-client-ip') ?? req.header('x-real-ip') ?? req.ip;
    const userAgent = req.header('user-agent');
    const bodyParams = JSON.stringify(req.body);
    const queryParams = JSON.stringify(req.query);

    this.logger.log(
      `{${method} ${url} ${queryParams} ${bodyParams}} - ${userAgent} ${ip}, traceId: ${traceId}`,
    );

    res.on('finish', () => {
      const { statusCode } = res;
      const timingInMs: number = Date.now() - now;
      const timingInS: number = timingInMs / 1000;

      this.logger.log(
        `{${method} ${url}} - ${statusCode} - ${userAgent} ${ip} +${timingInS}s (${timingInMs}ms), traceId: ${traceId}`,
      );
    });

    next();
  }
}
