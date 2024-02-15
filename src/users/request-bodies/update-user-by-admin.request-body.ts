import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  Length,
  IsOptional,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { UserRoleEnum } from '../../infrastructure/enums/user-role.enum';

export class UpdateUserByAdminRequestBody {
  @ApiProperty({ example: 'Steve', description: 'First name' })
  @IsString({ message: 'Must be a string' })
  firstName?: string;

  @ApiProperty({ example: 'Jobs', description: 'Last name' })
  @IsString({ message: 'Must be a string' })
  @IsOptional()
  lastName?: string;

  @ApiProperty({ example: 'example@gmail.com', description: 'Email' })
  @IsString({ message: 'Must be a string' })
  @IsEmail({}, { message: 'Must be email' })
  email?: string;

  @ApiProperty({
    example: 'Qwer1234',
    description: 'Password. Length must be from 8 to 30',
  })
  @IsString({ message: 'Must be a string' })
  @Length(8, 30, { message: 'Length must be from 8 to 30' })
  password?: string;

  @ApiProperty({ example: UserRoleEnum.ADMIN, description: 'Role of user' })
  @IsString({ message: 'Must be a string' })
  @IsEnum(UserRoleEnum, { message: "Must be equal of role's enum" })
  role?: UserRoleEnum;

  @ApiProperty({
    example: false,
    description: 'Value that meaning is can user create notes or not',
  })
  @IsBoolean({ message: 'Must be a boolean' })
  isCanCreateNotes?: boolean;
}
