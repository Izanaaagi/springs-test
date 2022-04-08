import { BadRequestException } from '@nestjs/common';

export class BadTokenException extends BadRequestException {
  constructor() {
    super({ message: 'Bad token' });
  }
}
