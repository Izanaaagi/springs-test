import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Post from '../../posts/entities/post.entity';
import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { Exclude } from 'class-transformer';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @Exclude()
  @MinLength(8)
  @MaxLength(16)
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Array<Post>;
}
