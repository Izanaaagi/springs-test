import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailTokenPayload } from './interfaces/email-token-payload';
import { EmailService } from '../email/email.service';
import { UsersService } from '../users/users.service';
import { EmailAlreadyConfirmedException } from './exceptions/email-already-confirmed.exception';
import { TokenExpiredException } from './exceptions/token-expired.exception';
import { BadTokenException } from './exceptions/bad-token.exception';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly usersService: UsersService,
  ) {}

  public sendVerificationLink(email: string) {
    const payload: EmailTokenPayload = { email };
    const token = this.jwtService.sign(payload);
    const url = `${this.configService.get('EMAIL_CONFIRMATION_URL')}/${token}`;

    const text = `Welcome, confirm your email: ${url}`;

    return this.emailService.sendMail({
      to: email,
      subject: 'Email confirmation',
      text,
    });
  }

  public async confirmEmail(email: string): Promise<void> {
    const user = await this.usersService.getByEmail(email);
    if (user.isEmailConfirmed) {
      throw new EmailAlreadyConfirmedException(email);
    }
    await this.usersService.markEmailAsConfirmed(email);
  }

  public async decodeConfirmationToken(token: string): Promise<string> {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new TokenExpiredException();
      }
      throw new BadTokenException();
    }
  }

  public async resendConfirmationLink(email: string): Promise<void> {
    const user = await this.usersService.getByEmail(email);
    if (user.isEmailConfirmed) {
      throw new EmailAlreadyConfirmedException(user.email);
    }
    await this.sendVerificationLink(user.email);
  }
}
