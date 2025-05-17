import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
  NotFoundException as NestNotFoundException,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { randomUUID } from 'node:crypto';
import { ExceptionConstants } from '../exceptions/constants';

@Catch(NestNotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('NotFoundExceptionFilter');

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: NestNotFoundException, host: ArgumentsHost): void {
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
        code: ExceptionConstants.BadRequestCodes.RESOURCE_NOT_FOUND,
        traceId,
        path,
      },
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, HttpStatus.NOT_FOUND);
  }
}
