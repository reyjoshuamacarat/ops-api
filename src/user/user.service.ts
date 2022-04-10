import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { User, Prisma } from '@prisma/client'

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

  async users(params: {
    where?: Prisma.UserWhereInput
    orderBy?: Prisma.UserOrderByWithRelationInput
    select?: Prisma.UserSelect
    include?: Prisma.UserInclude
  }): Promise<User[] | null> {
    return this.prisma.user.findMany({ ...params })
  }

  async createUser(data: User): Promise<User> {
    return this.prisma.user.create({ data })
  }
}
