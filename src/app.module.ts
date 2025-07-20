import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { Module, ValidationError, ValidationPipe } from '@nestjs/common';
import { AppController } from '@app/app.controller';
import { AppService } from '@app/app.service';
import { CommonModule } from '@core/common/common.module';
import { TimeoutInterceptor, LoggingInterceptor, ResponseInterceptor } from '@core/interceptors/index';
import { AllExceptionsFilter, BadRequestExceptionFilter, NotFoundExceptionFilter } from '@app/core/filters';
import { RouterModule } from '@modules/route.modules';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';

@Module({
  imports: [
    CommonModule,
    PrometheusModule.register({
      path: '/metrics',
    }),
    RouterModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
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
