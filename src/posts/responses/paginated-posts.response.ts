import Post from '../entities/post.entity';

export interface PaginatedPostsResponse {
  posts: Array<Post>;
  count: number;
}
