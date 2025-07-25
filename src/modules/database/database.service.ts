import { Injectable, Logger, OnModuleInit, OnModuleDestroy, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, PoolClient } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy, OnApplicationShutdown {
  private readonly logger = new Logger(DatabaseService.name);
  private pool: Pool;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    this.pool = new Pool({
      host: this.config.get('database.dbHost'),
      port: parseInt(this.config.get('database.dbPort')),
      user: this.config.get('database.dbUser'),
      password: this.config.get('database.dbPassword'),
      database: this.config.get('database.dbName'),
      connectionTimeoutMillis: 5000,
      max: 20,
    });

    this.pool
      .connect()
      .then((client: PoolClient) => {
        client.release();
        this.logger.log(
          `PostgreSQL connected to ${this.config.get('database.dbHost')}:${this.config.get('database.dbPort')}/${this.config.get('database.dbName')}`,
        );
      })
      .catch((err) => {
        this.logger.error('PostgreSQL connection failed', err.stack);
        process.exit(1);
      });
  }

  async onModuleDestroy() {
    await this.pool?.end();
    this.logger.log('PostgreSQL pool has been closed');
  }

  async onApplicationShutdown(signal: string) {
    this.logger.warn(`App is shutting down (signal: ${signal})`);
  }

  getPool(): Pool {
    return this.pool;
  }
}
