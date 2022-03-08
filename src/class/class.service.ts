import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Prisma, Class, User } from '@prisma/client'

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

  async createClass(data: Class): Promise<Class> {
    return this.prisma.class.create({ data })
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
}
