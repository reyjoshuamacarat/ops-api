import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { Activity as ActivityModel, Exam, User } from '@prisma/client'
import { ActivityService } from './activity.service'
import { subtractSeconds } from 'src/utils/utils.service'
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
    })
  }

  @Post()
  async createActivity(
    @Body() data: ActivityModel,
  ): Promise<ActivityModel | null> {
    if (data.name === 'USED_SEARCH_ENGINE') {
      const previousInstances = await this.activityService.activities({
        where: {
          examineeId: data.examineeId,
          examId: data.examId,
          name: 'USED_SEARCH_ENGINE',
          createdAt: {
            gte: subtractSeconds(new Date(), 4),
          },
        },
      })
      if (previousInstances?.length > 0) return null
    }

    data.examId = +data.examId
    data.examineeId = +data.examineeId
    return this.activityService.create(data)
  }
}
