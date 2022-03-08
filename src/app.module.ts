import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { ClassModule } from './class/class.module'
import { ExamModule } from './exam/exam.module'

@Module({
  imports: [UserModule, ClassModule, ExamModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
