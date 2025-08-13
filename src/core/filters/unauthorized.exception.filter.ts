import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { UnauthorizedException } from '@core/exceptions/unauthorized.exception';
import { randomUUID } from 'crypto';
import { WinstonLogger } from '@core/log/WinstonLogger';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly logger: WinstonLogger,
  ) {
    this.logger.setContext(UnauthorizedExceptionFilter.name);
  }

  catch(exception: UnauthorizedException, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    const traceId = randomUUID();
    const path = httpAdapter.getRequestUrl(request);

    exception.setTraceId(traceId);
    exception.setPath(path);

    this.logger.error({
      traceId: traceId,
      path: path,
      method: request.method,
      ip: request.ip,
      error: exception.message,
    });

    const responseBody = exception.generateHttpResponseBody();

    httpAdapter.reply(ctx.getResponse(), responseBody, HttpStatus.UNAUTHORIZED);
  }
}
