import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, catchError, tap, throwError } from 'rxjs';
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
        this.logger.log(`[${method}] ${url} - ${statusCode} - ${duration}ms - traceId: ${traceId}`, 'LoggingInterceptor');
      }),
      catchError((err) => {
        const duration = Date.now() - start;
        const statusCode = err?.status ?? 500;
        const message = err?.response?.message ?? err?.message ?? 'Internal Server Error';
        const stack = err?.stack;
        this.logger.error(`[${method}] ${url} - ${statusCode} - ${duration}ms - traceId: ${traceId} - ${message}`, stack, 'LoggingInterceptor');
        return throwError(() => err);
      }),
    );
  }
}
