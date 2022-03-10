import { Module } from '@nestjs/common'
import { ClassService } from './class.service'
import { ClassController } from './class.controller'
import { PrismaService } from '../prisma.service'

@Module({
  imports: [],
  controllers: [ClassController],
  providers: [PrismaService, ClassService],
})
export class ClassModule {}
