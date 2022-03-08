import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { User, Prisma, Class } from '@prisma/client'

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    })
  }

  async users(
    userWhereInput?: Prisma.UserWhereInput,
    orderBy?: Prisma.UserOrderByWithRelationInput,
  ): Promise<User[]> {
    return this.prisma.user.findMany({
      where: userWhereInput,
      orderBy,
    })
  }

  async usersFromClass(
    classId: Class['id'],
    orderBy?: Prisma.UserOrderByWithRelationInput,
  ): Promise<User[]> {
    return this.prisma.user.findMany({
      where: { Enrolment: { some: { classId } } },
      orderBy,
    })
  }

  async createUser(data: User): Promise<User> {
    return this.prisma.user.create({ data })
  }
}
