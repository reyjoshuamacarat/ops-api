import { Module } from '@nestjs/common'
import { UserModule } from './user/user.module'
import { ClassModule } from './class/class.module'
import { ExamModule } from './exam/exam.module'
import { ActivityModule } from './activity/activity.module'

@Module({
  imports: [UserModule, ClassModule, ExamModule, ActivityModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
