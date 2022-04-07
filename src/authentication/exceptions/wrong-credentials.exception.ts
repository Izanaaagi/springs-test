import { BadRequestException } from '@nestjs/common';

export class WrongCredentialsException extends BadRequestException {
  constructor() {
    super({ message: `Wrong credential provided` });
  }
}
