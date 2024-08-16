import { Logger } from '@nestjs/common';
import {
  QueryRunner,
  AbstractLogger,
  LogLevel,
  LogMessage,
  LoggerOptions,
  PrepareLogMessagesOptions,
} from 'typeorm';

export class MyCustomLogger extends AbstractLogger {
  private readonly logger: Logger = new Logger('SQL');

  protected options?: LoggerOptions;
  protected isLogEnabledFor(
    type?:
      | 'log'
      | 'warn'
      | 'info'
      | 'error'
      | 'schema'
      | 'query'
      | 'migration'
      | 'query-error'
      | 'query-slow'
      | 'schema-build',
  ): boolean {
    this.logger.log('type: ' + type);

    return true;
  }

  protected writeLog(
    level: LogLevel,
    message: string | number | LogMessage | (string | number | LogMessage)[],
    queryRunner?: QueryRunner,
  ): void {
    this.logger.log('writeLog: ' + message);
  }

  protected prepareLogMessages(
    logMessage: string | number | LogMessage | (string | number | LogMessage)[],
    options?: Partial<PrepareLogMessagesOptions>,
  ): LogMessage[] {
    this.logger.log(JSON.stringify(logMessage));
    return;
  }

  protected stringifyParams(parameters: any[]): string | any[] {
    const formattedParams = (params: any[]) => {
      let condition = true;
      let result = '';
      for (let i = 0; condition; i++) {
        result = result + params[i] + (params[i + 1] ? ', ' : '');

        if (params[i + 1] === undefined) {
          condition = false;
          return result;
        }
      }
      return result;
    };
    return parameters.length ? '[' + formattedParams(parameters) + ']' : '';
  }

  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    // const messages = this.prepareLogMessages(
    //   query + `${parameters ? parameters : ''}`,
    //   {
    //     highlightSql: true,
    //     appendParameterAsComment: true,
    //     addColonToPrefix: true,
    //   },
    // );
    this.logger.log(
      query + ' ' + (parameters ? this.stringifyParams(parameters) : ''),
    );
  }

  logQueryError(
    error: string | Error,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    this.logger.log('error: ', error);
    this.logger.log('query: ', query);
    this.logger.log('parameters: ', parameters);
  }

  logQuerySlow(
    time: number,
    query: string,
    parameters?: any[],
    queryRunner?: QueryRunner,
  ) {
    this.logger.log('time: ', time);
    this.logger.log('query: ', query);
    this.logger.log('parameters: ', parameters);
  }

  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    this.logger.log('logSchemaBuild -> message: ', message);
  }

  logMigration(message: string, queryRunner?: QueryRunner) {
    this.logger.log('logMigration -> message: ', message);
  }

  log(level: 'log' | 'warn' | 'info', message: any, queryRunner?: QueryRunner) {
    this.logger.log('log -> level: ', level);
    this.logger.log('log -> message: ', message);
  }
}
