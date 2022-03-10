import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { Prisma, Exam, User } from '@prisma/client'

@Injectable()
export class ExamService {
  constructor(private prisma: PrismaService) {}

  async exams(params: {
    where?: Prisma.ExamWhereInput
    orderBy?: Prisma.ExamOrderByWithRelationInput
  }): Promise<Exam[]> {
    const { where, orderBy } = params
    return this.prisma.exam.findMany({ where, orderBy })
  }

  async examsFromExaminee(params: {
    examineeId: User['id']
    where?: Prisma.ExamWhereInput
    orderBy?: Prisma.ExamOrderByWithRelationInput
  }): Promise<Exam[]> {
    const { examineeId, orderBy, where } = params
    return this.prisma.exam.findMany({
      where: {
        ...where,
        Class: { Enrolment: { some: { userId: examineeId } } },
      },
      orderBy,
    })
  }

  async examsFromProctor(params: {
    proctorId: User['id']
    where?: Prisma.ExamWhereInput
    orderBy?: Prisma.ExamOrderByWithRelationInput
  }): Promise<Exam[]> {
    const { proctorId, orderBy, where } = params
    return this.prisma.exam.findMany({
      where: {
        ...where,
        Class: { proctorId },
      },
      orderBy,
    })
  }

  async create(data: Exam): Promise<Exam> {
    return this.prisma.exam.create({ data })
  }
}
