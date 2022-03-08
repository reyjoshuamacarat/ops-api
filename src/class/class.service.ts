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

  async classes(
    classWhereInput?: Prisma.ClassWhereInput,
    orderBy?: Prisma.ClassOrderByWithRelationInput,
  ): Promise<Class[]> {
    return this.prisma.class.findMany({ where: classWhereInput, orderBy })
  }

  async classesFromProctor(
    proctorId: User['id'],
    orderBy?: Prisma.ClassOrderByWithRelationInput,
  ): Promise<Class[]> {
    return this.prisma.class.findMany({
      where: { proctorId: +proctorId },
      orderBy,
    })
  }

  async createClass(data: Class): Promise<Class> {
    return this.prisma.class.create({ data })
  }
}
