import { Controller, Get, Query } from '@nestjs/common'
import { ClassService } from './class.service'
import { Class as ClassModel, User } from '@prisma/client'

@Controller('class')
export class ClassController {
  constructor(private prisma: ClassService) {}

  @Get()
  async getClasses(
    @Query('proctorId') proctorId: User['id'],
  ): Promise<ClassModel[]> {
    if (proctorId) {
      return this.prisma.classesFromProctor(proctorId)
    }
    return this.prisma.classes()
  }

  @Get('/:id')
  async getClassById(@Query('id') id: ClassModel['id']): Promise<ClassModel> {
    return this.prisma.class({ id })
  }
}
