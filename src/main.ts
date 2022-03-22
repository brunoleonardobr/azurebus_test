import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AzureBusServer } from './transporter-server.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    strategy: new AzureBusServer({
      url: '',
    }),
  });

  app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
