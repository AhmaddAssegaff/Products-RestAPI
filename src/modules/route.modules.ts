import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { RouterModule as NestJsRouterModule } from '@nestjs/core';
import { ProductsModule } from './products/products.module';

@Module({})
export class RouterModule {
  static forRoot(): DynamicModule {
    const imports: (
      | DynamicModule
      | Type<any>
      | Promise<DynamicModule>
      | ForwardReference<any>
    )[] = [];
    imports.push(
      ProductsModule,
      // Register the base versioned path prefix "/v1".
      // Note: Specific paths like "/products" should be handled inside each controller.
      NestJsRouterModule.register([
        {
          path: 'v1', // This acts as a version prefix for all routes inside ProductsModule
          module: ProductsModule,
        },
      ]),
    );
    return {
      module: RouterModule,
      providers: [],
      exports: [],
      controllers: [],
      imports,
    };
  }
}
