import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePostRequestBody {
  @ApiProperty({ example: 'Tomo plans', description: 'Title of post' })
  @IsString({ message: 'Must be a string' })
  readonly title!: string;

  @ApiProperty({
    example:
      'I want to wake up early tomorrow. Then I will make exercises. ...',
    description: 'Description of post',
  })
  @IsString({ message: 'Must be a string' })
  readonly description!: string;
}
