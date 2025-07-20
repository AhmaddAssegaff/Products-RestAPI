import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '@products/dto/create-product.dto';
import { InterfaceProduct } from '@products/interface/products.interface';
import { QueryResult } from 'pg';
import { DatabaseService } from '@modules/database/database.service';
import { UpdateProductDto } from '../dto/update-product.dto';

const SQL = {
  INSERT_PRODUCT: 'INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *',
  SELECT_PRODUCT: 'SELECT * FROM products',
  SELECT_ONE_PRODUCT: 'SELECT * FROM products WHERE id = $1',
  UPDATE_ONE_PRODUCT: 'UPDATE products SET name = $1, price = $2 WHERE id = $3 RETURNING *',
  DELETE_ONE_PRODUCT: 'DELETE FROM products WHERE id = $1 RETURNING *',
};

@Injectable()
export class ProductsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createProductDto: CreateProductDto): Promise<InterfaceProduct> {
    const { name, price } = createProductDto;
    const pool = this.databaseService.getPool();
    const result: QueryResult<InterfaceProduct> = await pool.query(SQL.INSERT_PRODUCT, [name, price]);
    return result.rows[0];
  }

  async findAll(): Promise<InterfaceProduct[]> {
    const pool = this.databaseService.getPool();
    const result: QueryResult<InterfaceProduct> = await pool.query(SQL.SELECT_PRODUCT);
    return result.rows;
  }

  async findOne(id: string): Promise<InterfaceProduct> {
    const pool = this.databaseService.getPool();
    const result: QueryResult<InterfaceProduct> = await pool.query(SQL.SELECT_ONE_PRODUCT, [id]);
    return result.rows[0];
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<InterfaceProduct> {
    const { name, price } = updateProductDto;
    const pool = this.databaseService.getPool();
    const result: QueryResult<InterfaceProduct> = await pool.query(SQL.UPDATE_ONE_PRODUCT, [name, price, id]);
    return result.rows[0];
  }

  async delete(id: string) {
    const pool = this.databaseService.getPool();
    const result: QueryResult<InterfaceProduct> = await pool.query(SQL.DELETE_ONE_PRODUCT, [id]);
    return result.rows[0] || null;
  }
}
