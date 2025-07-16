import { Inject, Injectable } from '@nestjs/common';
import { CreateProductDto } from '@products/dto/create-product.dto';
import { InterfaceProduct } from '@products/interface/products.interface';
import { type QueryResult, Pool } from 'pg';

const SQL = {
  INSERT_PRODUCT:
    'INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *',
  SELECT_PRODUCT: 'SELECT * FROM products',
  SELECT_ONE_PRODUCT: 'SELECT * FROM products WHERE id = $1',
};

@Injectable()
export class ProductsRepository {
  constructor(@Inject('PG_POOL') private readonly pool: Pool) {}

  async create(createProductDto: CreateProductDto): Promise<InterfaceProduct> {
    const { name, price } = createProductDto;

    const result: QueryResult<InterfaceProduct> = await this.pool.query(
      SQL.INSERT_PRODUCT,
      [name, price],
    );

    return result.rows[0];
  }

  async findAll(): Promise<InterfaceProduct[]> {
    const result: QueryResult<InterfaceProduct> = await this.pool.query(
      SQL.SELECT_PRODUCT,
    );
    return result.rows;
  }

  async findOne(id: string): Promise<InterfaceProduct> {
    const result: QueryResult<InterfaceProduct> = await this.pool.query(
      SQL.SELECT_ONE_PRODUCT,
      [id],
    );
    return result.rows[0];
  }
}
