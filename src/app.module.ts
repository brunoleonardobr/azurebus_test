import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomTransportClientService } from './tranporter-client.service';
import { AzureBusServer } from './transporter-server.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, CustomTransportClientService, AzureBusServer],
})
export class AppModule {}
