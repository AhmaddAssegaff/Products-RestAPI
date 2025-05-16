import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Configs from '@config/index';
import * as Joi from 'joi';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      load: Configs,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      expandVariables: true,
      validationSchema: Joi.object({
        // app config
        PORT: Joi.number().default('3000').required(),
        API_PREFIX: Joi.string().required(),
        ENABLE_VERSION: Joi.boolean().required(),
        VERSION_PREFIX: Joi.string().required(),
        DEFAULT_VERSION: Joi.string().required(),
        TZ: Joi.string().required(),

        // swagger config
        SW_USERNAME: Joi.string().default('nest').required(),
        SW_PASSWORD: Joi.string().default('password').required(),
      }),
    }),
  ],
})
export class CommonModule {}
