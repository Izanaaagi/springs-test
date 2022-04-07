import { Column } from 'typeorm';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreatePostDto {
  @Column()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(64)
  title: string;

  @Column()
  @IsString()
  @IsNotEmpty()
  @MinLength(24)
  content: string;
}
