import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { Prisma, Exam, User } from '@prisma/client'

@Injectable()
export class ExamService {
  constructor(private prisma: PrismaService) {}

  async exam(
    examWhereUniqueInput: Prisma.ExamWhereUniqueInput,
  ): Promise<Exam | null> {
    return this.prisma.exam.findUnique({
      where: examWhereUniqueInput,
    })
  }
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

  async activeExam(params: { proctorId: User['id'] }): Promise<Exam | null> {
    const now = new Date()
    return this.prisma.exam.findFirst({
      where: {
        Class: { proctorId: params.proctorId },
        AND: { startTime: { lte: now }, AND: { endTime: { gte: now } } },
      },
    })
  }
}
