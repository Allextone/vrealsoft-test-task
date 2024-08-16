import { ApiProperty } from '@nestjs/swagger';

import { Users } from '../users.entity';

import { PaginationInterface } from '../../infrastructure/interfaces/pagination.interface';

export class UsersListResponseBody {
  @ApiProperty({ description: 'Array of users' })
  readonly usersList: Users[];

  @ApiProperty({ description: 'Information about pagination' })
  readonly pagination: PaginationInterface;
}
