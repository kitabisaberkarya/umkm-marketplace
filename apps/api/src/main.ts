import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('APP_PORT', 3001);
  const webUrl = configService.get<string>('WEB_URL', 'http://localhost:3000');
  const corsOrigins = configService
    .get<string>('CORS_ORIGINS', webUrl)
    .split(',')
    .map((o) => o.trim());

  app.use(helmet());

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  });

  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor(), new ResponseInterceptor());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('UMKMku API')
    .setDescription('REST API untuk platform marketplace UMKMku — seluruh produk UMKM Indonesia')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .addTag('auth', 'Autentikasi & otorisasi')
    .addTag('users', 'Manajemen pengguna')
    .addTag('seller-profiles', 'Profil & verifikasi toko')
    .addTag('categories', 'Kategori produk')
    .addTag('products', 'Manajemen produk')
    .addTag('cart', 'Keranjang belanja')
    .addTag('orders', 'Manajemen pesanan')
    .addTag('payments', 'Pembayaran & webhook')
    .addTag('shipments', 'Pengiriman')
    .addTag('reviews', 'Ulasan produk')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  await app.listen(port);
  console.log(`UMKMku API berjalan di: http://localhost:${port}/api`);
  console.log(`Swagger docs: http://localhost:${port}/api/docs`);
}

bootstrap();
