import { BadRequestException } from '@nestjs/common';

export class EmailAlreadyConfirmedException extends BadRequestException {
  constructor(email: string) {
    super({ message: `Email ${email} already confirmed` });
  }
}
