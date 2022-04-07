import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Post from '../../posts/entities/post.entity';
import { IsEmail, Max, Min } from 'class-validator';
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
  @Min(8)
  @Max(16)
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Array<Post>;
}
