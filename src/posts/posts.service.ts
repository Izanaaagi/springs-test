import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Post from './entities/post.entity';
import { PostNotFoundException } from './exceptions/post-not-found.exception';
import User from '../users/entities/user.entity';
import { PaginatedPostsResponse } from './responses/paginated-posts.response';

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

  async findAll(page = 1, limit = 25): Promise<PaginatedPostsResponse> {
    const offset = (page - 1) * limit;
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

  async remove(id: number): Promise<void> {
    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new PostNotFoundException(id);
    }
  }

  async search(
    searchString: string,
    page = 1,
    limit = 25,
  ): Promise<PaginatedPostsResponse> {
    const serializedSearchString = searchString.replace(/\s+/g, ':*&') + ':*';
    const offset = (page - 1) * limit;

    const searchResult = await this.postsRepository.query(
      `select *
       from post
                left join "user"
                          on "user".id = post."userId"
       where to_tsvector(post.title) @@ to_tsquery($1)
          or to_tsvector(post.content) @@ to_tsquery($1)
       limit $2 offset $3`,
      [serializedSearchString, limit, offset],
    );

    const count = searchResult.length;
    return searchResult.map((post) => ({
      posts: {
        id: post.id,
        title: post.title,
        content: post.content,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
        user: {
          id: post.userId,
          email: post.email,
        },
      },
      count,
    }));
  }
}
