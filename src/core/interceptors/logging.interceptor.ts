import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, tap } from 'rxjs';
import { randomUUID } from 'node:crypto';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const traceId = request.headers['x-request-id'] || randomUUID();
    request.headers['x-request-id'] = traceId;

    const { method, url } = request;

    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - start;
        const { statusCode } = response;

        this.logger.log(
          `[${traceId}] [${method}] ${url} - ${statusCode} - ${duration}ms`,
        );
      }),
      catchError((err) => {
        const duration = Date.now() - start;
        const { statusCode = 500, message, stack } = err;

        this.logger.warn(
          `[${traceId}] [${method}] ${url} - ${statusCode} - ${message} - ${duration}ms`,
        );
        if (stack) {
          this.logger.error(`[${traceId}] Stack: ${stack}`);
        }

        throw err;
      }),
    );
  }
}
