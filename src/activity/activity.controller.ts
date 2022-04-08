import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { Activity as ActivityModel, Exam, User } from '@prisma/client'
import { ActivityService } from './activity.service'
@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  async getActivities(
    @Query('examId') examId?: Exam['id'],
    @Query('examineeId') examineeId?: User['id'],
  ): Promise<ActivityModel[]> {
    return this.activityService.activities({
      where: { examId, examineeId },
      include: { Examinee: true },
      orderBy: { id: 'asc' },
    })
  }

  @Post()
  async createActivity(
    @Body() data: ActivityModel,
  ): Promise<ActivityModel | null> {
    data.examId = +data.examId
    data.examineeId = +data.examineeId
    return this.activityService.create(data)
  }
}
