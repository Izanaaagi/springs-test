import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Post from '../posts/entities/post.entity';
import { PostsStatistics } from './responses/posts-statistics';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async postsEveryDay(): Promise<Array<PostsStatistics>> {
    return await this.postsRepository
      .query(`select count(*), to_char("createdAt", 'dd-mm-yyyy') as date
              from post
              group by date`);
  }
}
