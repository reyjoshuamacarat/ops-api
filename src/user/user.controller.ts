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
    @Query('examId') examId: ExamModel['id'],
  ): Promise<UserModel[]> {
    examId = +examId
    const exam = await this.examService.exam({ id: +examId })

    if (exam)
      return this.userService.users({
        where: {
          Enrolment: { some: { classId: exam.classId } },
          AND: { Activity: { some: { examId } } },
        },
        select: {
          id: true,
          role: true,
          email: true,
          Activity: {
            where: { examId, isSuspicious: true },
          },
        },
      })

    throw new HttpException('Exam not found', HttpStatus.NOT_FOUND)
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
  async getUsersByClass(
    @Query('classId') classId?: Class['id'],
  ): Promise<UserModel[]> {
    if (classId) {
      classId = +classId
      return this.userService.users({
        where: { Enrolment: { some: { classId } } },
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
