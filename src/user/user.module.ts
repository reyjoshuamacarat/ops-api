import { UserService } from './user.service'
import { UserController } from './user.controller'
import { Module } from '@nestjs/common'
import { ExamModule } from 'src/exam/exam.module'
import { PrismaModule } from 'prisma/prisma.module'

@Module({
  imports: [ExamModule, PrismaModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
