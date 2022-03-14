import { Injectable } from '@nestjs/common'
import { generateCode } from '../utils/utils.service'
import { PrismaService } from '../../prisma/prisma.service'
import { Prisma, Class, User, Enrolment } from '@prisma/client'

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
    const { examineeId: userId, orderBy } = params
    return this.prisma.class.findMany({
      where: { Enrolment: { some: { userId } } },
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

  async enrolment(
    enrolmentWhereInput: Prisma.EnrolmentWhereInput,
  ): Promise<Enrolment | null> {
    return this.prisma.enrolment.findFirst({ where: enrolmentWhereInput })
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
