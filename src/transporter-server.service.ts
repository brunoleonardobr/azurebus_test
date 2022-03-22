import { ServiceBusClient, ServiceBusReceiver } from '@azure/service-bus';
import { Catch, LoggerService } from '@nestjs/common';
import {
  CustomTransportStrategy,
  RpcException,
  Server,
} from '@nestjs/microservices';

interface ServiceBusReceiverMap {
  [queue: string]: ServiceBusReceiver;
}

interface AzureBusServerOptions {
  url: string;
}

export class AzureBusServer extends Server implements CustomTransportStrategy {
  private serviceBusClient: ServiceBusClient;
  private receiverMap: ServiceBusReceiverMap = {};

  constructor(private readonly options: AzureBusServerOptions) {
    super();
  }

  async listen(callback: () => void) {
    this.serviceBusClient = new ServiceBusClient(this.options.url);
    this.bindHandlers();
    callback();
  }

  close() {
    for (const queue in this.receiverMap) {
      this.receiverMap[queue].close();
    }
    this.serviceBusClient.close();
  }

  private bindHandlers() {
    this.messageHandlers.forEach((handler, queue) => {
      if (handler.isEventHandler) {
        const receiver = this.getOrCreateReceiver(queue);
        receiver.subscribe(
          {
            processMessage: async (message) => {
              await handler({ message, receiver });
            },
            processError: async (err) => {},
          },
          { autoCompleteMessages: false },
        );
      }
    });
  }

  protected handleError(error) {
    console.log('erro:', error);
  }

  private getOrCreateReceiver(queue: string): ServiceBusReceiver {
    let receiver = this.receiverMap[queue];
    if (!receiver) {
      receiver = this.serviceBusClient.createReceiver(queue);
      this.receiverMap[queue] = receiver;
    }
    return receiver;
  }
}
