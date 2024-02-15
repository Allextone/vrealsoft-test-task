import { ApiProperty } from '@nestjs/swagger';
import { UsersNormalizeEntity } from '../../infrastructure/normalize-entities/users.normalize-entity';
import { PaginationInterface } from '../../infrastructure/interfaces/pagination.interface';

export class UsersListResponseBody {
  @ApiProperty({ description: 'Array of users' })
  readonly usersList: UsersNormalizeEntity[];

  @ApiProperty({ description: 'Information about pagination' })
  readonly pagination: PaginationInterface;
}
