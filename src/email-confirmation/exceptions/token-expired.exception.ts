import { BadRequestException } from '@nestjs/common';

export class TokenExpiredException extends BadRequestException {
  constructor() {
    super({ message: 'Token expired' });
  }
}
