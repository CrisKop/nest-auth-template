import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  constructor(@InjectConnection() private connection: Connection) {}

  async onModuleInit() {
    // Ensure the connection is established
    const isConnected = this.connection.readyState === 1;
    console.log(
      `Database connection status: ${isConnected ? 'Connected' : 'Disconnected'}`,
    );
  }
}
