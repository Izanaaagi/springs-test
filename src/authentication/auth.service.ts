import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import User from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { TokenPayload } from './interfaces/token-payload';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { ErrorCodes } from '../database/error-codes.enum';
import { TokensResponse } from './responses/tokens-response';
import { WrongCredentialsException } from './exceptions/wrong-credentials.exception';
import { ConfigService } from '@nestjs/config';
import { EmailAlreadyExistException } from './exceptions/email-already-exist.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
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
        throw new EmailAlreadyExistException(registerData.email);
      }
    }
  }

  async getAccessToken(id: number): Promise<string> {
    const payload: TokenPayload = { id };
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_EXPIRATION_TIME')}s`,
    });
  }

  async getRefreshToken(id: number): Promise<string> {
    const payload: TokenPayload = { id };
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: `${this.configService.get('JWT_REFRESH_EXPIRATION_TIME')}s`,
    });
  }

  async refreshTokens(id: number): Promise<TokensResponse> {
    const accessToken = await this.getAccessToken(id);
    const refreshToken = await this.getRefreshToken(id);

    await this.usersService.setCurrentRefreshToken(refreshToken, id);

    return { accessToken, refreshToken };
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
