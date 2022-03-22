import { Body, Controller, Get, Inject } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { CustomTransportClientService } from './tranporter-client.service';

@Controller()
export class AppController {
  constructor(
    private readonly transporter: CustomTransportClientService,
    private readonly appService: AppService,
  ) {}

  @Get()
  async queueEmmiter() {
    await this.transporter.emit('fila', { teste: 'teste' });
  }

  @EventPattern('fila')
  async queueConsumer(@Body() result) {
    let message = result.message;
    let receiver = result.receiver;
    let attempts = result.message.body.attempts
      ? result.message.body.attempts
        ? result.message.body.attempts
        : 0
      : result.message.deliveryCount;
    console.log(message.body.attempts);

    try {
      throw new Error('error');
    } catch (error) {
      if (attempts < 3) {
        await receiver.abandonMessage(message);
      } else if (attempts >= 3 && attempts < 10) {
        message.body.attempts = attempts++;
        await this.transporter.scheduleMessages('fila', message.body);
      } else {
        await receiver.deadLetterMessage(message);
      }
    }
    await receiver.completeMessage(result.message);
  }
}
