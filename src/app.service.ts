import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getAPI(): string {
    return 'This is the root of the API'
  }
}
