import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common'
import { Exam as ExamModel, Prisma, User } from '@prisma/client'
import { ExamService } from './exam.service'

@Controller('exams')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  @Get()
  async getExams(
    @Query()
    queryParams: Prisma.ExamWhereInput & {
      proctorId?: User['id']
      examineeId?: User['id']
    },
  ): Promise<ExamModel[]> {
    // eslint-disable-next-line prefer-const
    let { examineeId, proctorId, ...where } = queryParams

    // parse toplevel query params
    if (where.classId) where.classId = +where.classId

    if (examineeId) {
      examineeId = +examineeId
      return this.examService.examsFromExaminee({
        examineeId,
        where,
      })
    }

    if (proctorId) {
      proctorId = +proctorId
      return this.examService.examsFromProctor({
        proctorId,
        where,
      })
    }

    return this.examService.exams({ where })
  }

  @Get('/active')
  async getActiveExam(
    @Query('proctorId') proctorId: User['id'],
  ): Promise<ExamModel> {
    return this.examService.activeExam({ proctorId })
  }

  @Get('/:id')
  async getExamById(@Param('id') id: ExamModel['id']): Promise<ExamModel> {
    return this.examService.exam({ id: +id })
  }
  @Post()
  async createExam(@Body() data: ExamModel): Promise<ExamModel> {
    data.classId = +data.classId
    return this.examService.create(data)
  }
}
