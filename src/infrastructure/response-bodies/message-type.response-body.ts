import { ApiProperty } from '@nestjs/swagger';

export class MessageType {
  @ApiProperty({
    example: true,
    description: 'Notification of successful or unsuccessful execution.',
  })
  readonly message: boolean;
}
