import { Body, HttpException, HttpStatus, Param, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { ExamService } from '../exam/exam.service'
import { User as UserModel, Class, Exam as ExamModel } from '@prisma/client'
import { Controller, Get, Post } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly examService: ExamService,
  ) {}

  @Get('/activities')
  async getUsersActivitiesByExam(
    @Query('examId') examId?: ExamModel['id'],
  ): Promise<UserModel[]> {
    if (examId) {
      examId = +examId
      const exam = await this.examService.exam({ id: +examId })

      if (exam) {
        return this.userService.users({
          where: {
            Enrolment: { some: { classId: exam.classId } },
          },
          include: {
            Activity: {
              where: { examId, isSuspicious: true },
              orderBy: { createdAt: 'asc' },
            },
          },
        })
      }

      throw new HttpException('Exam not found', HttpStatus.NOT_FOUND)
    }

    return this.userService.users({
      include: {
        Activity: { orderBy: { createdAt: 'asc' } },
      },
    })
  }

  @Get('/get')
  async getUserByEmail(
    @Query('email') email: UserModel['email'],
  ): Promise<UserModel> {
    return this.userService.user({ email })
  }

  @Get('/:id')
  async getUserById(@Param('id') id: string): Promise<UserModel | null> {
    return this.userService.user({ id: +id })
  }

  @Get()
  async getUsers(
    @Query('classId') classId?: Class['id'],
    @Query('examId') examId?: ExamModel['id'],
  ): Promise<UserModel[]> {
    if (classId) {
      classId = +classId
      return this.userService.users({
        where: { Enrolment: { some: { classId } } },
      })
    } else if (examId) {
      examId = +examId
      return this.userService.users({
        where: {
          Activity: { some: { name: 'JOINED_EXAM' } },
          AND: {
            Activity: { none: { name: 'FINISHED_EXAM' } },
            AND: { Activity: { every: { examId } } },
          },
        },
        include: {
          Activity: {
            where: {
              isSuspicious: { equals: true },
            },
          },
        },
      })
    }
    return this.userService.users({})
  }

  @Post('/signup')
  async signup(@Body() data: UserModel): Promise<UserModel> {
    data.password = await this.hashPassword(data.password)
    return this.userService.createUser(data)
  }

  async hashPassword(password: UserModel['password']): Promise<string> {
    return await bcrypt.hash(password, 10)
  }

  @Post('/login')
  async login(@Body() data: UserModel): Promise<UserModel> {
    const user = await this.userService.user({ email: data.email })
    if (!user)
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED)

    const isValid = await bcrypt.compare(data.password, user.password)
    if (!isValid)
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED)

    return user
  }
}
