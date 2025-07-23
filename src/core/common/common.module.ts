import Configs from '@config/index';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: Configs,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env.local', `.env.${process.env.NODE_ENV}.local`, `.env.${process.env.NODE_ENV}`, '.env'],
      expandVariables: true,
      validationSchema: Joi.object({
        APP_PORT: Joi.number().required(),
        NODE_ENV: Joi.string().valid('development', 'test', 'staging', 'production').required(),
        API_PREFIX: Joi.string().required(),
        ENABLE_VERSION: Joi.boolean().required(),
        VERSION_PREFIX: Joi.string().required(),
        DEFAULT_VERSION: Joi.string().required(),
        TZ: Joi.string().required(),

        AUTH_JWT_ACCESS_TOKEN_EXPIRED: Joi.string(),
        AUTH_JWT_ACCESS_TOKEN_SECRET_KEY: Joi.string(),

        AUTH_JWT_REFRESH_TOKEN_EXPIRED: Joi.string(),
        AUTH_JWT_REFRESH_TOKEN_SECRET_KEY: Joi.string(),

        AUTH_JWT_PAYLOAD_ENCRYPT: Joi.boolean(),

        AUTH_JWT_PAYLOAD_ACCESS_TOKEN_ENCRYPT_KEY: Joi.string(),
        AUTH_JWT_PAYLOAD_ACCESS_TOKEN_ENCRYPT_IV: Joi.string(),

        AUTH_JWT_PAYLOAD_REFRESH_TOKEN_ENCRYPT_KEY: Joi.string(),
        AUTH_JWT_PAYLOAD_REFRESH_TOKEN_ENCRYPT_IV: Joi.string(),

        DB_NAME: Joi.string().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().hostname().required(),
        DB_PORT: Joi.number().port().required(),

        SW_USERNAME: Joi.string().default('nest').required(),
        SW_PASSWORD: Joi.string().default('password').required(),
        SW_PATH: Joi.string().default('/docs').required(),
      }),
      validationOptions: {
        abortEarly: true,
        allowUnknown: true,
      },
    }),
  ],
})
export class CommonModule {}
