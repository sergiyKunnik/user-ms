import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {

  const app = await NestFactory.createMicroservice(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 5000,
      },
    },
  );
  const configService = app.get(ConfigService);
  const port = configService.get('port');
  await app.listen(port );
  Logger.log(`Server is running http://0.0.0.0:${port}/`);
}
bootstrap();
