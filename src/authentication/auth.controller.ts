import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import RequestWithUser from './requests/request-with-user';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { TokensResponse } from './responses/tokens-response';
import User from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import JwtRefreshGuard from './guards/jwt-auth.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import JwtAuthGuard from './guards/jwt.guard';
import { EmailConfirmationService } from '../email-confirmation/email-confirmation.service';
import { EmailConfirmationGuard } from '../email-confirmation/guards/email-confirmation.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Post('/signUp')
  async signUp(@Body() registerData: CreateUserDto): Promise<User> {
    const user = await this.authService.signUp(registerData);
    await this.emailConfirmationService.sendVerificationLink(
      registerData.email,
    );
    return user;
  }

  @UseGuards(LocalAuthGuard, EmailConfirmationGuard)
  @Post('/signIn')
  async signIn(@Req() request: RequestWithUser): Promise<TokensResponse> {
    const { user } = request;
    return this.authService.refreshTokens(user.id);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('/refresh')
  refresh(
    @Body() body: RefreshTokenDto,
    @Req() request: RequestWithUser,
  ): Promise<TokensResponse> {
    const { user } = request;
    return this.authService.refreshTokens(user.id);
  }

  @Post('/signOut')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async signOut(@Req() request: RequestWithUser) {
    await this.usersService.removeRefreshToken(request.user.id);
  }
}
