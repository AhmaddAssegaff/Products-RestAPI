import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'PG_POOL',
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const pool = new Pool({
          host: config.get('database.dbHost'),
          port: parseInt(config.get('database.dbPort')),
          user: config.get('database.dbUser'),
          password: config.get('database.dbPassword'),
          database: config.get('database.dbName'),
          connectionTimeoutMillis: 5000,
        });

        try {
          await pool.connect();
          Logger.log(
            `PostgreSQL connected to ${config.get('database.dbHost')}:${config.get('database.dbPort')}/${config.get('database.dbName')}`,
            'DatabaseModule',
          );
        } catch (err) {
          Logger.error(
            'PostgreSQL connection failed',
            err.stack,
            'DatabaseModule',
          );
          process.exit(1);
        }

        return pool;
      },
    },
  ],
  exports: ['PG_POOL'],
})
export class DatabaseModule {}
