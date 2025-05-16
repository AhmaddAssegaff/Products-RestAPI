import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SWAGGER_CONFIG } from '@config/swagger.config';
import * as basicAuth from 'express-basic-auth';

export function createDocument(app: INestApplication) {
  const configService = app.get(ConfigService);

  const username = configService.get<string>('swagger.username') ?? 'admin';
  const password = configService.get<string>('swagger.password') ?? 'admin';
  const SWAGGER_PATH =
    configService.get<string>('swagger.path') || 'documentation';
  const appMode = configService.get<string>('app.mode');

  // Basic Auth for Swagger non-dev mode
  if (appMode !== 'development') {
    app.use(
      `/${SWAGGER_PATH}`,
      basicAuth({
        challenge: true,
        users: { [username]: password },
      }),
    );
  }

  const builder = new DocumentBuilder()
    .setTitle(SWAGGER_CONFIG.title)
    .setDescription(SWAGGER_CONFIG.description)
    .setVersion(SWAGGER_CONFIG.version)
    .addBearerAuth();
  SWAGGER_CONFIG.tags.forEach((tag) => {
    builder.addTag(tag);
  });

  const options = builder.build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(SWAGGER_PATH, app, document, {
    swaggerOptions: {
      docExpansion: 'none',
      showRequestDuration: true,
    },
  });
}
