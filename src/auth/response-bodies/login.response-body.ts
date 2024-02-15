import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from '../../infrastructure/enums/user-role.enum';

export class LoginResponseBody {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InF3ZXJAcXcuZXJyIiwiaWQiOiJkY2U2MzZiYS1mODIxLTRmZjItYmMxMC01NTg0YzA4MTdmNWEiLCJ0aW1lc3RhbXAiOiIyMDIzLTAyLTE2VDE4OjIwOjQzLjE0N1oiLCJpYXQiOjE2NzY1NzE2NDMsImV4cCI6MTY3NjY1ODA0M30.pxlIOBQhcg70nJOmdcfqnOnfWPT_66zGGmixFfAJHdI',
    description: 'Auth token',
  })
  readonly token: string;

  @ApiProperty({
    example: '442e8500-d67a-4f0a-a48f-30b602d4be68',
    description: 'UUID',
  })
  readonly id: string;

  @ApiProperty({ example: UserRoleEnum.ADMIN, description: 'User role' })
  readonly role: UserRoleEnum;
}
