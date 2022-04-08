import { BadRequestException } from '@nestjs/common';

export class EmailAlreadyExistException extends BadRequestException {
  constructor(email: string) {
    super({ message: `Email ${email} already exist` });
  }
}
