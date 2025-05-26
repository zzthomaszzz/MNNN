/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const dotenv = require('dotenv');
  dotenv.config({ path: './.env' });
  const app = await NestFactory.create(AppModule);

  app.enableCors({ 
    origin: true, 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization' });
  
    app.setGlobalPrefix('api');

  const port = process.env.PORT || 8082;
  
  await app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
}
bootstrap();
