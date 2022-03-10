import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Prisma, Class, User } from '@prisma/client'
import { generateCode } from '../utils'

@Injectable()
export class ClassService {
  constructor(private prisma: PrismaService) {}

  async class(
    classWhereUniqueInput: Prisma.ClassWhereUniqueInput,
  ): Promise<Class | null> {
    return this.prisma.class.findUnique({
      where: classWhereUniqueInput,
    })
  }

  async classes(params: {
    where?: Prisma.ClassWhereInput
    orderBy?: Prisma.ClassOrderByWithRelationInput
  }): Promise<Class[]> {
    const { where, orderBy } = params
    return this.prisma.class.findMany({ where, orderBy })
  }

  async classesFromExaminee(params: {
    examineeId: User['id']
    orderBy?: Prisma.ExamOrderByWithRelationInput
  }): Promise<Class[]> {
    const { examineeId, orderBy } = params
    return this.prisma.class.findMany({
      where: { Enrolment: { some: { userId: examineeId } } },
      orderBy,
    })
  }

  async createClass(data: Class): Promise<Class> {
    let code = generateCode()
    for (
      true;
      await this.prisma.class.findUnique({ where: { code } });
      code = generateCode()
    ) {}

    return this.prisma.class.create({
      data: { ...data, code, proctorId: +data.proctorId },
    })
  }

  async enrol(params: {
    classId: Class['id']
    examineeId: User['id']
  }): Promise<Class> {
    const { classId, examineeId } = params

    return this.prisma.class.update({
      where: { id: classId },
      data: { Enrolment: { create: { userId: +examineeId } } },
    })
  }
}
