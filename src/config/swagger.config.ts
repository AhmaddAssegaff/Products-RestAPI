import { SwaggerConfig } from '@core/interface/swagger.interface';
import { registerAs } from '@nestjs/config';

export const SWAGGER_CONFIG: SwaggerConfig = {
  title: 'nest Porto Ahmad',
  description: 'description swagger',
  version: '1.0',
  tags: [],
};

export default registerAs(
  'swagger',
  (): Record<string, any> => ({
    userName: process.env.SW_USERNAME || '',
    password: process.env.SW_PASSWORD || '',
    path: process.env.SW_PATH || '',
  }),
);
