import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import User from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { TokenPayload } from './interfaces/token-payload';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ErrorCodes } from '../database/error-codes.enum';
import { SignInResponse } from './responses/sign-in.response';
import { WrongCredentialsException } from './exceptions/wrong-credentials.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async signUp(registerData: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(registerData.password, 10);
    try {
      return await this.usersService.create({
        ...registerData,
        password: hashedPassword,
      });
    } catch (error) {
      if (error?.code === ErrorCodes.UniqueViolation) {
        throw new BadRequestException({
          message: 'User with that email already exist',
        });
      }
      throw new InternalServerErrorException();
    }
  }

  signIn(user: User): SignInResponse {
    const payload: TokenPayload = { id: user.id, email: user.email };
    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }

  async getAuthenticatedUser(
    email: string,
    plainTextPassword: string,
  ): Promise<User> {
    try {
      const user = await this.usersService.getByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);
      return user;
    } catch (error) {
      throw new WrongCredentialsException();
    }
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<void> {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new WrongCredentialsException();
    }
  }
}
