import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  UseGuards,
  Req,
  Post,
  Delete,
} from '@nestjs/common';
import {
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { PostsService } from './posts.service';
import { Posts } from './posts.entity';

import { RolesGuard } from '../infrastructure/guards/roles.guard';
import { JwtAuthGuard } from '../infrastructure/guards/jwt-auth.guard';
import { Roles } from '../infrastructure/decorators/roles.decorator';

import { UserRoleEnum } from '../infrastructure/enums/user-role.enum';

import { RequestInterface } from '../infrastructure/interfaces/request.interface';
import { CreatePostRequestBody } from './request-bodies/create-post.request-body';
import { UpdatePostRequestBody } from './request-bodies/update-post.request-body';
import { MessageType } from '../infrastructure/response-bodies/message-type.response-body';

@Controller('api')
@ApiTags('Posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @ApiOperation({ summary: 'Get post by postId' })
  @ApiResponse({ status: 200, type: Posts })
  @Get('posts/:postId/')
  @UseGuards(JwtAuthGuard)
  async getPost(@Req() req: RequestInterface, @Param('postId') postId: string) {
    return await this.postsService.getPost(req.user.id, postId);
  }

  @ApiOperation({ summary: 'Get list of posts by userId' })
  @ApiResponse({ status: 200, type: Posts })
  @Get('posts-list')
  @UseGuards(JwtAuthGuard)
  async getAllPosts() {
    return await this.postsService.getAllPosts();
  }

  @ApiOperation({ summary: 'Create post' })
  @ApiResponse({ status: 200, type: Posts })
  @Post('posts')
  @UseGuards(JwtAuthGuard)
  async createPost(
    @Req() req: RequestInterface,
    @Body() body: CreatePostRequestBody,
  ) {
    return await this.postsService.createPost(req.user.id, body);
  }

  @ApiOperation({ summary: 'Update post' })
  @ApiResponse({ status: 200, type: MessageType })
  @Put('posts/:postId/')
  @UseGuards(JwtAuthGuard)
  async updatePost(
    @Req() req: RequestInterface,
    @Param('postId') postId: string,
    @Body() body: UpdatePostRequestBody,
  ) {
    return await this.postsService.updatePost(req.user.id, postId, body);
  }

  @ApiOperation({ summary: 'Delete post' })
  @ApiResponse({ status: 200, type: MessageType })
  @Delete('posts/:postId/')
  @UseGuards(JwtAuthGuard)
  async deletePost(
    @Req() req: RequestInterface,
    @Param('postId') postId: string,
  ) {
    return await this.postsService.deletePost(req.user.id, postId);
  }

  // admin-panel
  @ApiExcludeEndpoint(true)
  @ApiOperation({ summary: 'Update post' })
  @ApiResponse({ status: 200, type: MessageType })
  @Put('admin-panel/posts/:postId/')
  @Roles(UserRoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updatePostByAdmin(
    @Req() req: RequestInterface,
    @Param('postId') postId: string,
    @Body() body: UpdatePostRequestBody,
  ) {
    return await this.postsService.updatePost(req.user.id, postId, body, true);
  }

  @ApiExcludeEndpoint(true)
  @ApiOperation({ summary: 'Delete post' })
  @ApiResponse({ status: 200, type: MessageType })
  @Delete('admin-panel/posts/:postId/')
  @Roles(UserRoleEnum.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deletePostByAdmin(
    @Req() req: RequestInterface,
    @Param('postId') postId: string,
  ) {
    return await this.postsService.deletePost(req.user.id, postId, true);
  }
}
