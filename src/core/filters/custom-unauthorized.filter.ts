import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { UnauthorizedException } from '@core/exceptions/unauthorized.exception';
import { randomUUID } from 'crypto';

@Catch(UnauthorizedException)
export class customUnauthorizedFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: UnauthorizedException, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    const traceId = randomUUID();
    const path = httpAdapter.getRequestUrl(request);

    exception.setTraceId(traceId);
    exception.setPath(path);

    const responseBody = exception.generateHttpResponseBody();

    httpAdapter.reply(ctx.getResponse(), responseBody, HttpStatus.UNAUTHORIZED);
  }
}
