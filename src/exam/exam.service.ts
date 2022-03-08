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
        class: { Enrolment: { some: { userId: examineeId } } },
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
        class: { proctorId },
      },
      orderBy,
    })
  }

  async createExam(data: Exam): Promise<Exam> {
    // return this.prisma.exam.create({
    //   data: {
    //     classId: 1,
    //     startTime: '1970-01-01T00:00:00.000Z',
    //     endTime: '2022-03-08T22:11:11.690Z',
    //     link: 'https://facebook.com',
    //     platform: 'GOOGLE_FORMS',
    //   },
    // })
    return this.prisma.exam.create({ data })
  }
}
