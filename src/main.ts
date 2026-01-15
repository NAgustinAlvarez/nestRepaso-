/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DataResponseInterceptor } from './common/interceptors/data-response/data-response.interceptor';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  //** swagger configuration */

  const config = new DocumentBuilder()
    .setTitle('Nestjs Repaso')
    .setDescription('Use the base API url as http://localhost:3000')
    .addServer('http://localhost:3000')
    .setVersion('1.0')
    .build();
  //instance Document
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  //enable cors
  app.enableCors({
    origin: '*',
  });
  // Add global Interceptor
  app.useGlobalInterceptors(new DataResponseInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
