import { Body, Controller, Get, Post } from '@nestjs/common'
import { Activity as ActivityModel } from '@prisma/client'
import { ActivityService } from './activity.service'

@Controller('activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  async getActivity(): Promise<ActivityModel[]> {
    return this.activityService.activities({})
  }

  @Post()
  async createActivity(@Body() data: ActivityModel): Promise<ActivityModel> {
    data.examId = +data.examId
    data.examineeId = +data.examineeId
    return this.activityService.create(data)
  }
}
