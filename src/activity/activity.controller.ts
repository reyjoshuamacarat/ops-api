import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import {
  Exam as ExamModel,
  Prisma,
  User,
  Activity as ActivityModel,
} from '@prisma/client'
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

// import { Controller, Post, Body, Get, Query } from '@nestjs/common'
// import { Activity as ActivityModel, Prisma } from '@prisma/client'
// import { ActivityService } from './activity.service'

// @Controller('qa')
// export class ActivityController {
//   constructor(private readonly activityService: ActivityService) {}

//   @Post()
//   async createActivity(@Body() data: ActivityModel) {
//     data.examId = +data.examId
//     data.examineeId = +data.examineeId
//     return this.activityService.create(data)
//   }

//   // @Get()
//   // async getActivities(
//   //   @Query() queryParams: Prisma.ActivityWhereInput,
//   // ): Promise<ActivityModel[]> {
//   //   return this.activityService.activities({
//   //     where: queryParams,
//   //   })
//   // }

//   @Get()
//   async getActivities(@Query() queryParams: {}): Promise<ActivityModel[]> {
//     return this.activityService.activities({})
//   }
// }
