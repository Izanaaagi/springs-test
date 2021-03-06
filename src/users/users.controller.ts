import { Body, Controller, Patch, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import JwtAuthGuard from '../authentication/guards/jwt.guard';
import RequestWithUser from '../authentication/requests/request-with-user';
import User from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch()
  update(
    @Req() request: RequestWithUser,
    @Body() updateData: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(request.user.id, updateData);
  }
}
