import {
  CallHandler,
  ExecutionContext,
  GatewayTimeoutException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, TimeoutError, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { ExceptionConstants } from '@core/exceptions/constants';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private readonly millisec: number = 30000) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(this.millisec),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(
            () =>
              new GatewayTimeoutException({
                message: 'Gateway Timeout',
                cause: new Error('Gateway Timeout'),
                code: ExceptionConstants.InternalServerErrorCodes
                  .GATE_WAY_TIME_OUT,
                description: 'Gateway Timeout',
              }),
          );
        }
        return throwError(() => err);
      }),
    );
  }
}
