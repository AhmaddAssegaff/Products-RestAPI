import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionConstants } from './constants';
import { IException, IHttpNotFoundExceptionResponse } from './interface';

export class NotFoundException extends HttpException {
  @ApiProperty({
    enum: ExceptionConstants.BadRequestCodes,
    description: 'A unique code identifying the error.',
    example: ExceptionConstants.BadRequestCodes.VALIDATION_ERROR,
  })
  code: number;

  @ApiHideProperty()
  cause: Error;

  @ApiProperty({
    description: 'Message for the exception',
    example: 'Bad Request',
  })
  message: string;

  @ApiProperty({
    description: 'A description of the error message.',
    example: 'The input provided was invalid',
  })
  description?: string;

  @ApiProperty({
    description: 'Timestamp of the exception',
    format: 'date-time',
    example: '2022-12-31T23:59:59.999Z',
  })
  timestamp: string;

  @ApiProperty({
    description: 'Trace ID of the request',
    example: '65b5f773-df95-4ce5-a917-62ee832fcdd0',
  })
  traceId: string;

  @ApiProperty({
    description: 'Request path',
    example: '/',
  })
  path: string;

  constructor(exception: IException) {
    super(exception.message, HttpStatus.NOT_FOUND, {
      cause: exception.cause,
      description: exception.description,
    });

    this.message = exception.message;
    this.cause = exception.cause ?? new Error();
    this.description = exception.description;
    this.code = exception.code ?? HttpStatus.NOT_FOUND;
    this.timestamp = new Date().toISOString();
  }

  setTraceId = (traceId: string) => {
    this.traceId = traceId;
  };

  setPath = (path: string) => {
    this.path = path;
  };

  generateHttpResponseBody = (
    message?: string,
  ): IHttpNotFoundExceptionResponse => {
    return {
      _metadata: {
        message: message || this.message,
        description: this.description,
        timestamp: this.timestamp,
        code: this.code,
        traceId: this.traceId,
        path: this.path,
      },
    };
  };
}
