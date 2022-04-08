import { IsNotEmpty, IsString } from 'class-validator';

export class ReconfirmEmailDto {
  @IsString()
  @IsNotEmpty()
  email: string;
}
