import { NotFoundException } from '@nestjs/common';

export class PostNotFoundException extends NotFoundException {
  constructor(id: number) {
    super({ message: `Post with id ${id} not found` });
  }
}
