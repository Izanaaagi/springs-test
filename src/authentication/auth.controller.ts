import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import RequestWithUser from './requests/request-with-user';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SignInResponse } from './responses/sign-in.response';
import User from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signUp')
  signUp(@Body() registerData: CreateUserDto): Promise<User> {
    return this.authService.signUp(registerData);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/signIn')
  signIn(@Req() request: RequestWithUser): SignInResponse {
    return this.authService.signIn(request.user);
  }
}
