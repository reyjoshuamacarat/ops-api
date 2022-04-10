import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { Prisma, Exam, User } from '@prisma/client'
import { isAfter, isBefore } from 'date-fns'
@Injectable()
export class ExamService {
  constructor(private prisma: PrismaService) {}

  async exam(
    examWhereUniqueInput: Prisma.ExamWhereUniqueInput,
  ): Promise<Exam | null> {
    const data = await this.prisma.exam.findUnique({
      where: examWhereUniqueInput,
    })

    return { ...data, status: this.getExamStatus(data.startTime, data.endTime) }
  }
  async exams(params: {
    where?: Prisma.ExamWhereInput
    orderBy?: Prisma.ExamOrderByWithRelationInput
  }): Promise<Exam[]> {
    const { where, orderBy } = params
    const data = this.prisma.exam.findMany({
      where,
      orderBy,
      include: { Activity: true },
    })

    return (await data).map((exam) => {
      const { Activity } = exam
      return {
        ...exam,
        status: this.getExamStatus(exam.startTime, exam.endTime),
        countTakers: Activity.filter(
          (activity) => activity.name === 'JOINED_EXAM',
        ).length,
        countActivity: Activity.filter((activity) => activity.isSuspicious)
          .length,
      }
    })
  }

  getExamStatus(startTime: Date, endTime: Date): Exam['status'] {
    const now = new Date()
    if (isAfter(startTime, now)) {
      return 'UPCOMING'
    } else if (isBefore(endTime, now)) {
      return 'FINISHED'
    } else {
      return 'ONGOING'
    }
  }

  async examsExcelData(params: { id: Exam['id'] }): Promise<Exam> {
    const { id } = params

    return this.prisma.exam.findUnique({
      where: { id },
      include: {
        Class: {
          include: {
            Enrolment: {
              select: {
                User: { include: { Activity: { where: { examId: id } } } },
              },
            },
          },
        },
      },
    })
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
    const returnData = await this.prisma.exam.create({ data })
    return {
      ...returnData,
      status: this.getExamStatus(
        new Date(data.startTime),
        new Date(data.endTime),
      ),
    }
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
