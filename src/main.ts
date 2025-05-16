import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerOptions } from '@config/logger.config';
import { createDocument } from '@core/docs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: WinstonModule.createLogger(winstonLoggerOptions),
  });

  const configService = app.get(ConfigService);

  const PORT = configService.get<string>('app.port') || 3090;

  const defaultVersion = configService.get<string>('app.defaultVersion') || '';
  const enableVersion = configService.get<string>('app.enableVersion') || true;

  const globalPrefix = configService.get<string>('app.globalPrefix') || '';
  const versionPrefix = configService.get<string>('app.versionPrefix') || '';

  const tz = configService.get<string>('app.tz') || '';
  process.env.TZ = tz;

  app.enableCors();
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(globalPrefix);
  createDocument(app);

  if (enableVersion) {
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion,
      prefix: versionPrefix,
    });
  }

  await app.listen(PORT);
  Logger.log(`Application listening on port ${PORT}`);
}
bootstrap();
