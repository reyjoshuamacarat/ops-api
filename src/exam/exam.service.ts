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
    const { status, ...rest } = where

    let data = await this.prisma.exam.findMany({
      where: rest,
      orderBy,
      include: { Activity: true },
    })

    if (status) {
      data = data.filter(
        (exam) => status === this.getExamStatus(exam.startTime, exam.endTime),
      )
    }

    return data.map((exam) => {
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

  getExamStatus(
    startTime: Exam['startTime'],
    endTime: Exam['endTime'],
  ): Exam['status'] {
    const now = new Date()
    if (isAfter(startTime, now)) {
      return 'UPCOMING'
    } else if (isBefore(endTime, now)) {
      return 'FINISHED'
    } else {
      return 'ONGOING'
    }
  }

  async examsFromExaminee(params: {
    examineeId?: User['id']
    where?: Prisma.ExamWhereInput
    orderBy?: Prisma.ExamOrderByWithRelationInput
  }): Promise<Exam[]> {
    const { examineeId, orderBy, where } = params

    return this.exams({
      where: {
        ...where,
        Class: { Enrolment: { some: { userId: examineeId } } },
        Activity: examineeId
          ? { none: { name: 'FINISHED_EXAM', examineeId } }
          : {},
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
    return this.exams({
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
}
