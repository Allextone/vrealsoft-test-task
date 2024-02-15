import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateNoteRequestBody {
  @ApiProperty({ example: 'Tomo plans', description: 'Title of note' })
  @IsString({ message: 'Must be a string' })
  title!: string;

  @ApiProperty({
    example:
      'I want to wake up early tomorrow. Then I will make exercises. ...',
    description: 'Description of note',
  })
  @IsString({ message: 'Must be a string' })
  description!: string;
}
