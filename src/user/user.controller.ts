import { Body, HttpException, HttpStatus, Param, Query } from '@nestjs/common'
import { UserService } from './user.service'
import { User as UserModel, Class } from '@prisma/client'
import { Controller, Get, Post } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/:id')
  async getUserById(@Param('id') id: string): Promise<UserModel | null> {
    return this.userService.user({ id: +id })
  }
  @Get()
  async getUsers(
    @Query('classId') classId?: Class['id'],
  ): Promise<UserModel[]> {
    if (classId) {
      return this.userService.usersFromClass(+classId)
    }
    return this.userService.users()
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
