import { NestFactory } from '@nestjs/core';

import helmet from 'helmet';

import { AppModule } from './app.module';
import * as dotenv from "dotenv";
import * as process from "process";

dotenv.config({ path: __dirname+'/../../.env' });

const port = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (req, callback) => callback(null, true),
  });
  app.use(helmet());

  await app.listen(port);
}
bootstrap().then(() => {
  console.log('App is running on %s port', port);
});
