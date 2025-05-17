import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  async getHello(): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, 30001));
  }
}
