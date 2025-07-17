import { ApiProperty } from '@nestjs/swagger';
import { InterfaceCreateProductInput } from '@products/interface/products.interface';
import { IsString, IsInt } from 'class-validator';

export class CreateProductDto implements InterfaceCreateProductInput {
  @ApiProperty({ example: 'Pupuk Organik', description: 'Nama produk' })
  @IsString()
  name: string;

  @ApiProperty({ example: 10000, description: 'Harga produk' })
  @IsInt()
  price: number;
}
