import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { Module, ValidationError, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from '@core/common/common.module';
import { TimeoutInterceptor } from '@core/interceptors/timeout.interceptor';
import { LoggingInterceptor } from '@core/interceptors/logging.interceptor';

@Module({
  imports: [CommonModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
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
      useFactory: () => {
        const timeoutInMilliseconds = 30000;
        return new TimeoutInterceptor(timeoutInMilliseconds);
      },
      inject: [],
    },
  ],
})
export class AppModule {}
