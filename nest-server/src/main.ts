import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { cloudinaryConnect } from './common/config/cloudinaryConnect';
// import * as fileUpload from 'express-fileupload';
// const fileUpload = require("express-fileupload");
// https://chatgpt.com/share/68667404-2720-800f-ae1c-d2b635b0350a
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
   const expressApp = app.getHttpAdapter().getInstance();

  expressApp.set('trust proxy', 1);
  app.enableCors();

  // app.use(
  cloudinaryConnect()


  await app.listen(process.env.PORT ?? 4000);
  
   
}
bootstrap();
