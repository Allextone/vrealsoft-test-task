import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';

import { Posts } from './posts.entity';

import { DataNotFoundException } from '../infrastructure/exceptions/data-not-found.exceptions';

import { MessageType } from '../infrastructure/response-bodies/message-type.response-body';
import { CreatePostInterface } from './interfaces/create-post.interface';
import { UpdatePostInterface } from './interfaces/update-post.interface';
import { CreatePostServiceInput } from './service-inputs/create-post.service-input';
import { UpdatePostServiceInput } from './service-inputs/update-post.service-input';
import { NotAllowedUserIdException } from 'src/infrastructure/exceptions/not-allowed-user-id.exception';

@Injectable()
export class PostsService {
  private logger: Logger = new Logger(PostsService.name);

  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(Posts)
    private postsRepository: Repository<Posts>,
  ) {}

  private async getOne(
    userId: string,
    postId: string,
    strict = true,
    isAdminRequest = false,
  ): Promise<Posts> {
    const post: Posts = await this.postsRepository.findOne({
      where: { id: postId },
    });

    if (!post && strict) {
      throw new DataNotFoundException('Post does not found or not exist');
    }

    if (!isAdminRequest && post.userId !== userId) {
      throw new NotAllowedUserIdException('User can not get this post');
    }

    return post;
  }

  private async getAll(): Promise<Posts[]> {
    return await this.postsRepository.find({
      order: { createdDate: 'ASC' },
    });
  }

  private async getAllByUserId(userId: string): Promise<Posts[]> {
    return await this.postsRepository.find({
      where: { userId },
      order: { createdDate: 'ASC' },
    });
  }

  private async create(body: CreatePostInterface): Promise<MessageType> {
    await this.postsRepository.save(body);
    return { message: true };
  }

  private async update(
    postId: string,
    body: UpdatePostInterface,
  ): Promise<MessageType> {
    await this.postsRepository.save({ id: postId, ...body });

    return { message: true };
  }

  private async delete(postId: string): Promise<MessageType> {
    await this.postsRepository.delete(postId);
    return { message: true };
  }

  // -----------------------------------------------------------------------------------

  async getPost(userId: string, postId: string): Promise<Posts> {
    return await this.getOne(userId, postId);
  }

  async getPostsList(userId: string): Promise<Posts[]> {
    return await this.getAllByUserId(userId);
  }

  async getAllPosts(): Promise<Posts[]> {
    return await this.getAll();
  }

  async createPost(
    userId: string,
    body: CreatePostServiceInput,
  ): Promise<MessageType> {
    const { title, description }: CreatePostServiceInput = body;

    const options: CreatePostInterface = {
      title,
      description,
      userId,
    };

    await this.create(options);

    return { message: true };
  }

  async updatePost(
    userId: string,
    postId: string,
    body: UpdatePostServiceInput,
    isAdminRequest = false,
  ): Promise<MessageType> {
    const { title, description }: UpdatePostServiceInput = body;

    const post: Posts = await this.getOne(userId, postId, true, isAdminRequest);

    const options: UpdatePostInterface = {};
    if (title) Object.assign(options, { title });
    if (description) Object.assign(options, { description });

    await this.update(post.id, options);

    return { message: true };
  }

  async deletePost(
    userId: string,
    postId: string,
    isAdminRequest = false,
  ): Promise<MessageType> {
    const post: Posts = await this.getOne(userId, postId, true, isAdminRequest);

    await this.delete(post.id);
    return { message: true };
  }

  // admin panel
  async getAllNotes(): Promise<Posts[]> {
    return await this.getAll();
  }
}
