import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.use((req, res, next) => {
    console.log('Incoming request:', req.method, req.url, req.headers);
    next();
  });

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
