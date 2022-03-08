import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { ExamController } from './exam.controller'
import { ExamService } from './exam.service'

@Module({
  imports: [],
  controllers: [ExamController],
  providers: [PrismaService, ExamService],
})
export class ExamModule {}
