import { Controller, Get, Param, Post } from '@nestjs/common';
import { ConfirmEmailDto } from './dto/confirm-email.dto';
import { ReconfirmEmailDto } from './dto/reconfirm-email.dto';
import { EmailConfirmationService } from './email-confirmation.service';

@Controller('emailConfirmation')
export class EmailConfirmationController {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  @Get('confirm/:token')
  async confirm(@Param() confirmationData: ConfirmEmailDto) {
    const email = await this.emailConfirmationService.decodeConfirmationToken(
      confirmationData.token,
    );
    await this.emailConfirmationService.confirmEmail(email);
    return { message: 'Email successfully confirmed' };
  }

  @Post('/resend/:email')
  async resendConfirmationLink(@Param() reconfirmData: ReconfirmEmailDto) {
    await this.emailConfirmationService.resendConfirmationLink(
      reconfirmData.email,
    );
    return { message: 'Email sent again' };
  }
}
