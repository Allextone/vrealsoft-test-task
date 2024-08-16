import { UserRoleEnum } from '../../infrastructure/enums/user-role.enum';

export interface JwtTokenPayloadInterface {
  email: string;
  user: {
    id: string;
    role: UserRoleEnum;
  };
}
