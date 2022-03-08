import { UserService } from './user.service'
import { UserController } from './user.controller'
import { Module } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Module({
  imports: [],
  controllers: [UserController],
  providers: [PrismaService, UserService],
})
export class UserModule {}
