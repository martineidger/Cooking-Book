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

  app.enableCors(/*{
    origin: true, // или конкретные домены ['http://localhost:3000', 'https://yourdomain.com']
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization, X-Requested-With',
  }*/);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
