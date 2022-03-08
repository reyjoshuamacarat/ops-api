import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { ClassModule } from './class/class.module'

@Module({
  imports: [UserModule, ClassModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
