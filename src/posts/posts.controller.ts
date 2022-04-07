import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  Query,
  Post,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import JwtAuthGuard from '../auth/guards/jwt.guard';
import { PaginationParamsDto } from '../database/dto/pagination.dto';
import PostEntity from './entities/post.entity';
import { PaginatedPostsResponse } from './responses/paginated-posts.response';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto): Promise<PostEntity> {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll(
    @Query('searchString') searchString: string,
    @Query() { offset, limit }: PaginationParamsDto,
  ): Promise<PaginatedPostsResponse> {
    if (searchString) {
      // return this.postsService.search(searchString, offset, limit);
    }
    return this.postsService.findAll(offset, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<PostEntity> {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
    return await this.postsService.update(id, updatePostDto);
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.postsService.remove(id);
  }
}
