import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Param,
} from '@nestjs/common'
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
  async getClassById(@Param('id') id: ClassModel['id']): Promise<ClassModel> {
    return this.classService.class({ id: +id })
  }

  @Post()
  async createClass(@Body() data: ClassModel): Promise<ClassModel> {
    data.proctorId = +data.proctorId
    return this.classService.createClass(data)
  }

  @Post('/enrol')
  async enrol(
    @Body() data: { code: ClassModel['code']; examineeId: User['id'] },
  ): Promise<ClassModel> {
    const { code, examineeId } = data
    const classInstance = await this.classService.class({ code })

    const enrolment = await this.classService.enrolment({
      classId: classInstance.id,
      userId: +examineeId,
    })

    if (enrolment)
      throw new HttpException(
        'User is already enrolled in this class',
        HttpStatus.BAD_REQUEST,
      )

    if (!classInstance)
      throw new HttpException('Class not found', HttpStatus.NOT_FOUND)

    return this.classService.enrol({
      classId: classInstance.id,
      examineeId,
    })
  }
}
