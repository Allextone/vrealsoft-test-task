import { ApiProperty } from '@nestjs/swagger';

export class NotesNormalizeEntity {
  @ApiProperty({
    example: '74b5614b-43fb-4ef4-afc4-a4209197e9dc',
    description: 'Id of note',
  })
  id: string;

  @ApiProperty({ example: 'Shopping list', description: 'Title of note' })
  title: string;

  @ApiProperty({
    example: '1. Milk; 2. Bread; 3.Sugar;',
    description: 'Discription of note',
  })
  description: string;

  @ApiProperty({
    example: 'fb254615-9894-44b4-bb33-354ec2010aa5',
    description: 'User id (owner of notes)',
  })
  userId: string;

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
