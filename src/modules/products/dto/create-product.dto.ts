import { InterfaceCreateProductInput } from '@products/interface/products.interface';
import { IsString, IsInt } from 'class-validator';

export class CreateProductDto implements InterfaceCreateProductInput {
  @IsString()
  name: string;

  @IsInt()
  price: number;
}
