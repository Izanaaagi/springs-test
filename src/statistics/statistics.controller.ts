import { Controller, Get, UseGuards } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import JwtAuthGuard from '../authentication/guards/jwt.guard';
import { PostsStatistics } from './responses/posts-statistics';

@Controller('statistics')
@UseGuards(JwtAuthGuard)
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('/posts')
  postsEveryDay(): Promise<Array<PostsStatistics>> {
    return this.statisticsService.postsEveryDay();
  }
}
