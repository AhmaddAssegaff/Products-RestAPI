import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus, GatewayTimeoutException } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { randomUUID } from 'node:crypto';
import { ExceptionConstants } from '../exceptions/constants';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const traceId = randomUUID();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let responseBody: any;

    const code =
      exception instanceof GatewayTimeoutException
        ? ExceptionConstants.InternalServerErrorCodes.GATE_WAY_TIME_OUT
        : ExceptionConstants.InternalServerErrorCodes.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      const message =
        typeof exceptionResponse === 'object' && exceptionResponse !== null ? ((exceptionResponse as any).message ?? exception.message) : exception.message;

      const description =
        typeof exceptionResponse === 'object' && exceptionResponse !== null
          ? ((exceptionResponse as any).error ?? HttpStatus[httpStatus])
          : HttpStatus[httpStatus];

      responseBody = {
        _metadata: {
          message: Array.isArray(message) ? message[0] : message,
          description,
          timestamp: new Date().toISOString(),
          code,
          traceId,
          path: httpAdapter.getRequestUrl(ctx.getRequest()),
        },
      };
    } else {
      responseBody = {
        _metadata: {
          message: (exception as Error)?.message || 'Unexpected error occurred',
          description: 'Internal Server Error',
          timestamp: new Date().toISOString(),
          code,
          traceId,
          path: httpAdapter.getRequestUrl(ctx.getRequest()),
        },
      };
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
