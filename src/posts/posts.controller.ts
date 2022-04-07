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
  Req,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import JwtAuthGuard from '../authentication/guards/jwt.guard';
import { PaginationParamsDto } from '../database/dto/pagination.dto';
import PostEntity from './entities/post.entity';
import { PaginatedPostsResponse } from './responses/paginated-posts.response';
import RequestWithUser from '../authentication/requests/request-with-user';
import { PermissionGuard } from './guards/permission.guard';

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: RequestWithUser,
  ): Promise<PostEntity> {
    return this.postsService.create(createPostDto, req.user);
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
  @UseGuards(PermissionGuard)
  async update(
    @Param('id') id: number,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostEntity> {
    return await this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard)
  @HttpCode(204)
  remove(@Param('id') id: number): Promise<void> {
    return this.postsService.remove(id);
  }
}
