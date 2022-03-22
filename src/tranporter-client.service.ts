import { ServiceBusClient } from '@azure/service-bus';
import { Injectable } from '@nestjs/common';
import { ClientProxy, ReadPacket, WritePacket } from '@nestjs/microservices';

@Injectable()
export class CustomTransportClientService extends ClientProxy {
  private serviceBusClient: ServiceBusClient;
  constructor() {
    super();
    this.serviceBusClient = new ServiceBusClient('');
  }
  async connect(): Promise<any> {
    console.log('connect');
  }
  close() {
    console.log('close');
  }
  protected publish(
    packet: ReadPacket<any>,
    callback: (packet: WritePacket<any>) => void,
  ): () => void {
    throw new Error('Method not implemented.');
  }

  async scheduleMessages(queue, message) {
    const sender = this.serviceBusClient.createSender(queue);
    const scheduledEnqueueTimeUtc = new Date(Date.now() + 10000);
    await sender.scheduleMessages([{ body: message }], scheduledEnqueueTimeUtc);
  }

  protected async dispatchEvent<T = any>(packet: ReadPacket<any>): Promise<T> {
    const sender = this.serviceBusClient.createSender(packet.pattern);
    const body = { body: packet.data };
    console.log(packet.data);
    await sender.sendMessages(body);
    sender.close();
    throw new Error('Method not implemented.');
  }
}
