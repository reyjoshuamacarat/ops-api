import { Controller, Get, Query } from '@nestjs/common'
import { ClassService } from './class.service'
import { Class as ClassModel, Prisma, User } from '@prisma/client'

@Controller('classes')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get()
  async getClasses(
    @Query()
    queryParams: Prisma.ClassWhereInput & {
      proctorId?: User['id']
      examineeId?: User['id']
    },
  ): Promise<ClassModel[]> {
    if (queryParams.examineeId) {
      queryParams.examineeId = +queryParams.examineeId
      return this.classService.classesFromExaminee({
        examineeId: queryParams.examineeId,
      })
    }

    if (queryParams.proctorId) queryParams.proctorId = +queryParams.proctorId
    return this.classService.classes({ where: queryParams })
  }

  @Get('/:id')
  async getClassById(@Query('id') id: ClassModel['id']): Promise<ClassModel> {
    return this.classService.class({ id })
  }
}
