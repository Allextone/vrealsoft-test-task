import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from '../enums/user-role.enum';

export class UsersNormalizeEntity {
  @ApiProperty({
    example: '442e8500-d67a-4f0a-a48f-30b602d4be68',
    description: 'UUID',
  })
  id: string;

  @ApiProperty({ example: 'Steve', description: 'First name' })
  firstName: string;

  @ApiProperty({ example: 'Jobs', description: 'Last name' })
  lastName: string;

  @ApiProperty({ example: 'example@gmail.com', description: 'Email' })
  email: string;

  @ApiProperty({
    example: 'Qwer1234!',
    description: 'Password. Length must be from 8 to 30',
  })
  password: string;

  @ApiProperty({ description: 'Role of user' })
  role: UserRoleEnum;

  @ApiProperty({
    example: true,
    description: 'Value that meaning is can user create notes or not',
  })
  isCanCreateNotes: boolean;

  @ApiProperty({
    example: '2023-01-10 17:34:05.929',
    description: 'Created date',
  })
  createdDate: Date;

  @ApiProperty({
    example: '2023-01-10 17:34:05.929',
    description: 'Updated date',
  })
  updatedDate: Date;

  @ApiProperty({
    example: '2023-01-10 17:34:05.929',
    description: 'Deleted date',
  })
  deletedDate: Date;
}
