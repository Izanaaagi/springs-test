import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Post from './entities/post.entity';
import { PostNotFoundException } from './exceptions/post-not-found.exception';
import User from '../users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, user: User): Promise<Post> {
    const newPost = await this.postsRepository.create({
      ...createPostDto,
      user,
    });
    await this.postsRepository.save(newPost);
    return newPost;
  }

  async findAll(offset = 0, limit = 25) {
    const [posts, count] = await this.postsRepository.findAndCount({
      relations: ['user'],
      order: {
        id: 'ASC',
      },
      skip: offset,
      take: limit,
    });

    return {
      posts,
      count,
    };
  }

  async findOne(id: number): Promise<Post> {
    const post = await this.postsRepository.findOne(id, {
      relations: ['user'],
    });
    if (post) {
      return post;
    }
    throw new PostNotFoundException(id);
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<Post> {
    await this.postsRepository.update(id, updatePostDto);
    const updatedPost = await this.postsRepository.findOne(id);
    if (updatedPost) {
      return updatedPost;
    }
    throw new PostNotFoundException(id);
  }

  async remove(id: number) {
    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new PostNotFoundException(id);
    }
  }

  // search(
  //   searchSting: string,
  //   offset = 0,
  //   limit = 25,
  // ): Promise<PaginatedPostsResponse> {
  // return `search`;
  // }
}
