import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from '@app/app.module';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerOptions } from '@config/logger.config';
import { createDocument } from '@core/docs/swagger';
import { ConfigService } from '@nestjs/config';
import { collectDefaultMetrics, Registry } from 'prom-client';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: WinstonModule.createLogger(winstonLoggerOptions),
  });

  const register = new Registry();
  collectDefaultMetrics({ register });

  app.enableShutdownHooks();

  const configService = app.get(ConfigService);

  const env = configService.get<string>('app.mode');
  const PORT = configService.get<string>('app.port');

  const defaultVersion = configService.get<string>('app.defaultVersion');
  const enableVersion = configService.get<string>('app.enableVersion');

  const globalPrefix = configService.get<string>('app.globalPrefix');
  const versionPrefix = configService.get<string>('app.versionPrefix');

  const tz = configService.get<string>('app.tz');
  process.env.TZ = tz;

  app.enableCors();
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix(globalPrefix);

  if (enableVersion) {
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion,
      prefix: versionPrefix,
    });
    createDocument(app);
  }

  await app.listen(PORT);
  Logger.log(`Running in ${env} mode`, 'Bootstrap');
  Logger.log(`Application listening on port ${PORT}`, 'Bootstrap');
}
bootstrap();
