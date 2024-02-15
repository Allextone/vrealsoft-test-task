import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { hashSync, compareSync, genSaltSync } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
// import { generate } from 'generate-password';

import { AppLogger } from '../infrastructure/logger/logger';
import { Users } from './users.entity';
import { UsersNormalizeEntity } from '../infrastructure/normalize-entities/users.normalize-entity';
import { normalizeData } from '../helpers/helpers-functions';
import { DataNotFoundException } from '../infrastructure/exceptions/data-not-found.exceptions';
import { validateEmail } from '../infrastructure/validators/email.validator';
import { MessageType } from '../infrastructure/response-bodies/message-type.response-body';
import { UpdateUserInterface } from './interfaces/update-user.interface';
import { validatePassword } from '../infrastructure/validators/password.validator';
import { NotProvidedPasswordDataException } from '../infrastructure/exceptions/not-provided-passwords-data.exceptions';
import { NotValidPasswordException } from '../infrastructure/exceptions/not-valid-password.exception';
import { CreateUserInterface } from './interfaces/create-user.interface';
import { CreateUserRequestBody } from './request-bodies/create-user.request-body';
import { UsersListResponseBody } from './response-bodies/users-list.response-body';
import { UpdateUserByAdminInterface } from './interfaces/update-user-by-admin.interface';
import { UpdateUserRequestBody } from './request-bodies/update-user.request-body';
import { UpdateUserByAdminRequestBody } from './request-bodies/update-user-by-admin.request-body';

@Injectable()
export class UsersService {
  private logger = new AppLogger('UsersService');

  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  private async getOne(
    userId: string,
    traceId: string,
    strict = true,
    withPassword = false,
  ): Promise<UsersNormalizeEntity> {
    const user: UsersNormalizeEntity = normalizeData(
      await this.usersRepository.findOne({
        where: { id: userId },
        select: { password: withPassword }, //TODO: test
        comment: traceId,
      }),
    );

    if (!user && strict) {
      throw new DataNotFoundException('User does not found or not exist');
    }

    return user;
  }

  private async getOneByEmail(
    email: string,
    traceId: string,
  ): Promise<UsersNormalizeEntity> {
    return normalizeData(
      await this.usersRepository.findOne({
        where: { email: email },
        select: { password: true, id: true, role: true },
        comment: traceId,
      }),
    );
  }

  private async getAll(traceId: string): Promise<UsersNormalizeEntity[]> {
    return normalizeData(
      await this.usersRepository.findOne({
        comment: traceId,
        order: { created_date: 'DESC' },
      }),
    );
  }

  private async update(
    userId: string,
    body: UpdateUserInterface,
    traceId: string,
  ): Promise<MessageType> {
    await this.usersRepository
      .createQueryBuilder('users')
      .update()
      .set(normalizeData(body, false))
      .where('users.id = :userId', { userId })
      .comment(`traceId: ${traceId}`)
      .execute();

    return { message: true };
  }

  private async create(
    body: CreateUserInterface,
    traceId: string,
  ): Promise<MessageType> {
    await this.usersRepository
      .createQueryBuilder('users')
      .insert()
      .values(normalizeData(body, false))
      .comment(`traceId: ${traceId}`)
      .execute();

    return { message: true };
  }

  private async delete(userId: string, traceId: string): Promise<MessageType> {
    await this.usersRepository
      .createQueryBuilder('users')
      .delete()
      .where('users.id = :userId', { userId })
      .comment(`traceId: ${traceId}`)
      .execute();

    return { message: true };
  }

  async getUser(
    userId: string,
    traceId: string,
  ): Promise<UsersNormalizeEntity> {
    return await this.getOne(userId, traceId);
  }

  async getUserByEmail(
    email: string,
    traceId: string,
  ): Promise<UsersNormalizeEntity> {
    return await this.getOneByEmail(validateEmail(email), traceId);
  }

  async updateUser(
    userId: string,
    body: UpdateUserRequestBody,
    traceId: string,
  ): Promise<MessageType> {
    const {
      email,
      firstName,
      lastName,
      newPassword,
      oldPassword,
    }: UpdateUserRequestBody = body;

    const user: UsersNormalizeEntity = await this.getOne(
      userId,
      traceId,
      true,
      true,
    );

    const options: UpdateUserInterface = {};

    if (email) {
      this.logger.log(`Job [updateUser] -> new email: ${email}`);
      Object.assign(options, { email: validateEmail(email) });
    }

    if (firstName || firstName === '') {
      this.logger.log(`Job [updateUser] -> new firstName: ${firstName}`);
      Object.assign(options, { firstName: firstName });
    }

    if (lastName || lastName === '') {
      this.logger.log(`Job [updateUser] -> new lastName: ${lastName}`);
      Object.assign(options, { lastName: lastName });
    }

    if ((newPassword && !oldPassword) || (!newPassword && oldPassword)) {
      throw new NotProvidedPasswordDataException();
    }

    if (newPassword && oldPassword) {
      if (newPassword === oldPassword) {
        throw new NotValidPasswordException(
          'New and old password can not be equal',
        );
      }

      if (!validatePassword(newPassword)) {
        throw new NotValidPasswordException('New password is invalid');
      }

      const valid: boolean = compareSync(oldPassword, user.password);
      if (!valid) {
        throw new NotValidPasswordException('Old password is incorrect');
      }

      this.logger.log(`Job [updateUser] -> new password: ${newPassword}`);
      // this.logger.log('Job [updateUser] -> new password');
      Object.assign(options, { password: hashSync(newPassword) });
    }

    await this.update(userId, options, traceId);

    return { message: true };
  }

  async createUser(
    body: CreateUserRequestBody,
    traceId: string,
  ): Promise<MessageType> {
    const { email, password, firstName, lastName }: CreateUserRequestBody =
      body;

    // TODO: add validator of non provided fields of body

    const salt: string = genSaltSync(12);
    const hashedPassword: string = hashSync(password, salt);

    const options: CreateUserInterface = {
      firstName,
      lastName,
      email: validateEmail(email),
      password: hashedPassword,
    };
    this.logger.log(`Job [createUser] -> options of creating user: ${options}`);

    await this.create(options, traceId);
    return { message: true };
  }

  async deleteUser(userId: string, traceId: string): Promise<MessageType> {
    await this.delete(userId, traceId);
    return { message: true };
  }

  // admin-panel
  async getUsers(
    traceId: string,
    offset = 0,
    limit = 20,
    searchKey?: string,
  ): Promise<UsersListResponseBody> {
    try {
      const userQuery = await this.usersRepository.createQueryBuilder('users');

      if (searchKey) {
        userQuery.where(
          `(LOWER(users.first_name) LIKE LOWER(:searchKey)
          OR LOWER(users.last_name) LIKE LOWER(:searchKey)
          OR LOWER(users.email) LIKE LOWER(:searchKey))`,
          {
            searchKey: `%${searchKey}%`,
          },
        );
      }

      const [usersData, total] = await userQuery
        .orderBy('users.created_date', 'DESC')
        .comment(`traceId: ${traceId}`)
        .skip(offset)
        .take(limit)
        .getManyAndCount();

      return {
        usersList: normalizeData(usersData),
        pagination: {
          page: parseInt(String(offset / limit + 1)),
          perPage: limit,
          total,
        },
      };
    } catch (err) {
      this.logger.error(`Failed to get users. Reason: ${err}.`);
      throw new Error('Failed to get users');
    }
  }

  private async updateByAdmin(
    userId: string,
    body: UpdateUserByAdminInterface,
    traceId,
  ): Promise<MessageType> {
    await this.usersRepository
      .createQueryBuilder('users')
      .update()
      .set(normalizeData(body, false))
      .where('users.id = :userId', { userId })
      .comment(`traceId: ${traceId}`)
      .execute();

    return { message: true };
  }

  async updateUserByAdmin(
    userId: string,
    body: UpdateUserByAdminRequestBody,
    traceId: string,
  ): Promise<MessageType> {
    const {
      email,
      firstName,
      lastName,
      password,
      role,
      isCanCreateNotes,
    }: UpdateUserByAdminRequestBody = body;

    const options: any = {};

    if (email) {
      this.logger.log(`Job [updateUserByAdmin] -> new email: ${email}`);
      Object.assign(options, { email: validateEmail(email) });
    }

    if (firstName || firstName === '') {
      this.logger.log(`Job [updateUserByAdmin] -> new firstName: ${firstName}`);
      Object.assign(options, { firstName: firstName });
    }

    if (lastName || lastName === '') {
      this.logger.log(`Job [updateUserByAdmin] -> new lastName: ${lastName}`);
      Object.assign(options, { lastName: lastName });
    }

    if (password) {
      this.logger.log(`Job [updateUserByAdmin] -> new password: ${password}`);
      Object.assign(options, { password: hashSync(password) });
    }

    if (role) {
      this.logger.log(`Job [updateUserByAdmin] -> new role: ${role}`);
      Object.assign(options, { role: role });
    }

    if (isCanCreateNotes !== null && isCanCreateNotes !== undefined) {
      this.logger.log(
        `Job [updateUserByAdmin] -> new isCanCreateNotes: ${isCanCreateNotes}`,
      );
      Object.assign(options, { isCanCreateNotes: isCanCreateNotes });
    }

    await this.updateByAdmin(userId, options, traceId);
    return { message: true };
  }
}
