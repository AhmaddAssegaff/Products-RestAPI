import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { DatabaseModule } from '@modules/database/database.module';
import { ProductsModule } from '@modules/products/products.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';

@Module({})
export class RouterModule {
  static forRoot(): DynamicModule {
    const imports: (DynamicModule | Type<any> | Promise<DynamicModule> | ForwardReference<any>)[] = [];
    imports.push(DatabaseModule, AuthModule, UsersModule, ProductsModule);
    return {
      module: RouterModule,
      providers: [],
      exports: [],
      controllers: [],
      imports,
    };
  }
}
