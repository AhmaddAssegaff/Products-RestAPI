import Configs from '@config/index';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: Configs,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      expandVariables: true,
      validationSchema: Joi.object({
        APP_PORT: Joi.number().required(),
        API_PREFIX: Joi.string().required(),
        ENABLE_VERSION: Joi.boolean().required(),
        VERSION_PREFIX: Joi.string().required(),
        DEFAULT_VERSION: Joi.string().required(),
        TZ: Joi.string().required(),

        DB_NAME: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().hostname().required(),
        DB_PORT: Joi.number().port().required(),

        SW_USERNAME: Joi.string().default('nest').required(),
        SW_PASSWORD: Joi.string().default('password').required(),
        SW_PATH: Joi.string().default('/docs').required(),
      }),
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('databse.DB_HOST'),
        port: configService.get<number>('database.DB_PORT'),
        username: configService.get<string>('database.DB_USER'),
        password: configService.get<string>('database.DB_PASS'),
        database: configService.get<string>('database.DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, // Hanya untuk dev
      }),
    }),
  ],
})
export class CommonModule {}
