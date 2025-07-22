import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const req = context.switchToHttp().getRequest();

    if (req?.url?.startsWith('/api/v1/metrics')) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data) => {
        return {
          _metadata: {
            statusCode: response.statusCode,
            message: 'Success',
          },
          _data: data ?? {},
        };
      }),
    );
  }
}
