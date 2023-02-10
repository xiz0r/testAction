import { User } from '@app/db/models/user.model';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserDto } from 'libs/models/user';
import { UserService } from 'src/services/user/user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService
  ) { }

  @Get(':email')
  get (@Param() params): Promise<UserDto> {
    const email:string = params.email
    return this.userService.get(email)
  }

  @Post()
  async create(@Body() payload: UserDto): Promise<User> {
    return await this.userService.create(payload);
  }
}