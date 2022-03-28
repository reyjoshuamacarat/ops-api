import { Injectable } from '@nestjs/common'
import { Activity, Prisma } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService) {}

  async create(data: Activity): Promise<Activity> {
    return this.prisma.activity.create({ data, include: { Examinee: true } })
  }

  async activities(params: {
    where?: Prisma.ActivityWhereInput
    orderBy?: Prisma.ActivityOrderByWithRelationInput
  }) {
    const { where, orderBy } = params
    return this.prisma.activity.findMany({ where, orderBy })
  }
}
