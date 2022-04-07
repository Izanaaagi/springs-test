import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import RequestWithUser from '../../authentication/requests/request-with-user';
import { PostsService } from '../posts.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private postsService: PostsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const {
      params: { id },
      user,
    } = request;
    const post = await this.postsService.findOne(+id);
    return post.user.id === user.id;
  }
}
