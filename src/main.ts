import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AzureBusServer } from './transporter-server.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    strategy: new AzureBusServer({
      url: 'Endpoint=sb://demonstracao-mensageria.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=KY0cdG1ZV/y1YrmfBKhOf0DtTh9C4uZE3aGpqO1ZAOo=',
    }),
  });

  app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
