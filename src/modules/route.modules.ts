import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { ProductsModule } from '@modules/products/products.module';

@Module({})
export class RouterModule {
  static forRoot(): DynamicModule {
    const imports: (
      | DynamicModule
      | Type<any>
      | Promise<DynamicModule>
      | ForwardReference<any>
    )[] = [];
    imports.push(ProductsModule);
    return {
      module: RouterModule,
      providers: [],
      exports: [],
      controllers: [],
      imports,
    };
  }
}
