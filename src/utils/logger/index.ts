import os from 'os';
import { createLogger, format, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { consoleFormat } from 'winston-console-format';
import config from '../../config';


class LogManager {
  private static instance: LogManager;
  private logger: ReturnType<typeof createLogger>;


  private constructor() {
    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
      ),
      exceptionHandlers: [new transports.File({ filename: 'logs/exception.log' })],
      rejectionHandlers: [new transports.File({ filename: 'logs/rejections.log' })],
      defaultMeta: { service: process.env.npm_lifecycle_event },
      transports: [
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' }),
        new DailyRotateFile({
          level: 'info',
          filename: 'logs/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD-HH',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
        }),
      ],
    });

    if (!config.env.isProduction) {
      this.logger.add(
        new transports.Console({
          format: format.combine(format.colorize(), format.simple()),
        })
      );
    }

    this.logger.info(`Logging system up and running!`);
  }

  public static getLogger(): ReturnType<typeof createLogger> {
    if (!LogManager.instance) {
      LogManager.instance = new LogManager();
    }

    return LogManager.instance.logger;
  }
}

export default LogManager.getLogger();
