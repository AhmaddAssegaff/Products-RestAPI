import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger, UnauthorizedException } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { randomUUID } from 'node:crypto';
import { ExceptionConstants } from '../exceptions/constants';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(UnauthorizedException.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: UnauthorizedException, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const traceId = randomUUID();

    const path = httpAdapter.getRequestUrl(ctx.getRequest());
    const method = ctx.getRequest().method;

    this.logger.warn(`[${traceId}] [${method}] ${path} - ${exception.message}`);

    const responseBody = {
      _metadata: {
        message: exception.message || 'Resource Not Found',
        description: 'The requested resource could not be found',
        timestamp: new Date().toISOString(),
        code: ExceptionConstants.UnauthorizedCodes.UNAUTHORIZED_ACCESS,

        traceId,
        path,
      },
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, HttpStatus.UNAUTHORIZED);
  }
}
