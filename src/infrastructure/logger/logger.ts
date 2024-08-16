import { Inject, Injectable, LoggerService } from '@nestjs/common';
import { format } from 'date-fns';
import { createLogger, transports } from 'winston';
import stableStringify from 'fast-safe-stringify';
import { AsyncLocalStorage } from 'async_hooks';

import { ASYNC_STORAGE } from './logger.constants';

const contextsToIgnore = [
  'NestFactory',
  'InstanceLoader',
  'RoutesResolver',
  'RouterExplorer',
  'NestApplication',
];

export const MAX_SLICE_MESSAGE_LENGTH = 80;

function jsonStringify(
  value: any,
  replacer = undefined,
  space = undefined,
): string {
  return stableStringify(value, replacer, space, {
    depthLimit: 16,
    edgesLimit: 16,
  });
}

function parseProcessIndex() {
  if ('HOSTNAME' in process.env) {
    const result = /^(.*)-(\d+)$/.exec(process.env.HOSTNAME);

    if (result) {
      return Number.parseInt(result[2]);
    }
  }

  if ('NODE_APP_INSTANCE' in process.env) {
    return Number.parseInt(process.env.NODE_APP_INSTANCE);
  }

  return 0;
}

/**
 * format meta data from object to string
 */
const formattedMeta = (meta: any) => {
  const metaKeys = Object.keys(meta);
  if (!metaKeys.length) {
    return '';
  }

  const metaValues = Object.values(meta);

  let condition = true;
  let result = '';
  for (let i = 0; condition; i++) {
    result =
      result +
      metaKeys[i] +
      ': ' +
      metaValues[i] +
      (metaKeys[i + 1] ? ', ' : '');

    if (!metaKeys[i + 1]) {
      condition = false;
      return result;
    }
  }
  return result;
};

const infoLogger = createLogger({
  level: 'verbose',
  transports: [
    // new transports.Console(),
    new transports.File({
      filename: 'app-logs.log',
      dirname: process.cwd(),
      eol: '\n',
      tailable: true,
    }),
  ],
  handleExceptions: true,
  handleRejections: true,
});

@Injectable()
export class AppLogger implements LoggerService {
  protected context: string;
  private readonly processIndex: number;
  protected printMessage: (
    message: any,
    context: string,
    skipIgnore: boolean,
    type: string,
    meta: any,
  ) => void;

  constructor(
    @Inject(ASYNC_STORAGE)
    private readonly asyncStorage?: AsyncLocalStorage<Map<string, string>>,
  ) {
    this.processIndex = parseProcessIndex();

    this.printMessage = this.printMessageConsole;

    if (process.env.LOG_FORMAT === 'ELK') {
      this.printMessage = this.printMessageELK;
    }
  }

  debug(message: any, context?: string, meta: any = {}): any {
    this.printMessage?.(message, context, false, 'DEBUG', meta);
  }

  error(message: any, trace?: string, context?: string, meta: any = {}): any {
    if (message instanceof Error) {
      this.printMessage?.(message.message, context, true, 'ERROR', {
        ...meta,
        err: message,
      });

      return;
    }

    this.printMessage?.(message, context, true, 'ERROR', meta);

    if (trace) {
      this.printMessage?.(trace, context, true, 'TRACE', meta);
    }
  }

  log(message: any, context?: string, meta: any = {}): any {
    this.printMessage?.(message, context, false, 'INFO', meta);
  }

  verbose(message: any, context?: string, meta: any = {}): any {
    this.printMessage?.(message, context, false, 'INFO', meta);
  }

  warn(message: any, context?: string, meta: any = {}): any {
    if (message instanceof Error) {
      this.printMessage?.(message.message, context, true, 'WARN', {
        ...meta,
        err: message,
      });

      return;
    }

    this.printMessage?.(message, context, true, 'WARN', meta);
  }

  successExit(): any {
    this.log('Success Exit');
    process.exit(0);
  }

  failedExit(err): any {
    this.error(err);
    process.exit(1);
  }

  infoHandler(message: string) {
    infoLogger.info(message, {
      // date: new Date(),
      // traceId: traceId || null,
    });
  }

  protected printMessageConsole(
    message: any,
    context: string,
    skipIgnore: boolean,
    type: string,
    meta: any = {},
  ) {
    const now = new Date();

    if (!context) {
      context = this.context ?? 'MAIN';
    }

    if (!skipIgnore && contextsToIgnore.includes(context)) {
      return;
    }

    let log = console.log;

    switch (type) {
      case 'DEBUG':
        log = console.debug;
        break;
      case 'INFO':
        log = console.info;
        break;
      case 'WARN':
        log = console.warn;
        break;
      case 'ERROR':
        log = console.error;
        break;
    }

    const date = format(now, 'yy/MM/dd HH:mm:ss.SSS xxx');

    const infoData = `[${type}] | ${date} | LOG [${context}]: `;

    const traceId: string = this.asyncStorage.getStore()?.get('traceId');

    if (message instanceof Object) {
      console.dir(message, { depth: 16, sorted: true });
    } else {
      const messageForLog =
        context === 'HTTP'
          ? `\u001b[1;32m${message}\u001b[39m`
          : context === 'SQL'
          ? `\u001b[1;36m${message}\u001b[39m`
          : context === 'EXCEPTION'
          ? `\u001b[1;31m${message}\u001b[39m`
          : message;
      log(
        `\u001b[1;34m${infoData} \u001b[39m` + messageForLog,
        ` ${
          traceId !== undefined ? `\u001b[1;33m ${traceId} \u001b[39m` : '-'
        }`,
      );

      this.infoHandler(
        infoData + message + ` ${traceId !== undefined ? traceId : '-'}`,
      );
    }
    if (Object.keys(meta).length > 0) {
      console.dir(meta, { depth: 16, sorted: true });
    }
    console.groupEnd();
  }

  protected printMessageELK(
    message: any,
    context: string,
    skipIgnore: boolean,
    type: string,
    meta: any = {},
  ) {
    const now = new Date();

    if (!context) {
      context = this.context ?? 'MAIN';
    }

    if (!skipIgnore && contextsToIgnore.includes(context)) {
      return;
    }

    let text = message;
    let obj = {};

    if (message instanceof Object) {
      text = jsonStringify(obj).slice(0, MAX_SLICE_MESSAGE_LENGTH);
      obj = message;
    }

    const msg = `[${type}] ${text}`;

    const data = {
      ...obj,
      ...meta,
      timestamp: now.getTime() / 1000.0,
      type,
      message: msg,
      context,
      app_version: '0.0.1',
    };

    console.log(jsonStringify(data));
  }
}
