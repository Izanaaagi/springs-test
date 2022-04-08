import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Post from '../../posts/entities/post.entity';
import { IsEmail, MaxLength, MinLength } from 'class-validator';
import { Exclude } from 'class-transformer';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  @MinLength(8)
  @MaxLength(16)
  password: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @OneToMany(() => Post, (post) => post.user)
  posts: Array<Post>;

  @Column({
    nullable: true,
  })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @Column({ default: false })
  public isEmailConfirmed: boolean;
}
