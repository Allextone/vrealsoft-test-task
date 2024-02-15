import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, Length } from 'class-validator';

export class LoginRequestBody {
  @ApiProperty({ example: 'example@gmail.com', description: 'Email' })
  @IsString({ message: 'Must be a string' })
  @IsEmail({}, { message: 'Must be email' })
  email!: string;

  @ApiProperty({
    example: 'Qwer1234',
    description: 'Password. Length must be from 8 to 30',
  })
  @IsString({ message: 'Must be a string' })
  @Length(8, 30, { message: 'Length must be from 8 to 30' })
  password!: string;
}
