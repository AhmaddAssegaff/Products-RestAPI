import { Module } from '@nestjs/common';
import { ProductsService } from '@products/products.service';
import { ProductsController } from '@products/products.controller';
import { DatabaseModule } from '@database/database.module';
import { ProductsRepository } from '@products/repository/product.repository';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository],
})
export class ProductsModule {}
