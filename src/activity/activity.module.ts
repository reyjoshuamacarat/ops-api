import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

import { ActivityService } from './activity.service'
import { ActivityController } from './activity.controller'

@Module({
  imports: [],
  controllers: [ActivityController],
  providers: [PrismaService, ActivityService],
})
export class ActivityModule {}
