import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { Module, ValidationError, ValidationPipe } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { CommonModule } from '@core/common/common.module';
import { TimeoutInterceptor, LoggingInterceptor, ResponseInterceptor } from '@core/interceptors/index';
import {
  AllExceptionsFilter,
  BadRequestExceptionFilter,
  NotFoundExceptionFilter,
  ValidationExceptionFilter,
  ForbiddenExceptionFilter,
  UnauthorizedExceptionFilter,
} from '@app/core/filters';
import { RouterModule } from '@modules/route.modules';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { WinstonLogger } from '@core/log/WinstonLogger';
import { Logger as WinstonBaseLogger, createLogger } from 'winston';
import { winstonLoggerOptions } from '@config/logger.config';

@Module({
  imports: [
    CommonModule,
    PrometheusModule.register({
      path: '/metrics',
    }),
    RouterModule.forRoot(),
  ],
  exports: [WinstonLogger],
  controllers: [AppController],
  providers: [
    AppService,
    WinstonLogger,
    {
      provide: WinstonBaseLogger,
      useFactory: () => createLogger(winstonLoggerOptions),
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: BadRequestExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: UnauthorizedExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ForbiddenExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ValidationExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          transform: true,
          exceptionFactory: (errors: ValidationError[]) => {
            return errors[0];
          },
        }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useFactory: () => {
        const timeoutInMilliseconds = 30000;
        return new TimeoutInterceptor(timeoutInMilliseconds);
      },
      inject: [],
    },
  ],
})
export class AppModule {}
