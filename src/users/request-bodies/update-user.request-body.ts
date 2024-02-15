import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, Length, IsOptional } from 'class-validator';

export class UpdateUserRequestBody {
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
    description: 'New password. Length must be from 8 to 30',
  })
  @IsString({ message: 'Must be a string' })
  @Length(8, 30, { message: 'Length must be from 8 to 30' })
  oldPassword?: string;

  @ApiProperty({
    example: 'Qwer1234!',
    description: 'Old password. Length must be from 8 to 30',
  })
  @IsString({ message: 'Must be a string' })
  @Length(8, 30, { message: 'Length must be from 8 to 30' })
  newPassword?: string;
}
