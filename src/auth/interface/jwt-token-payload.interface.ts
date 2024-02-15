import { UserRoleEnum } from '../../infrastructure/enums/user-role.enum';

export interface JwtTokenPayloadInterface {
  email: string;
  sub: {
    user_id: string;
    user_role: UserRoleEnum;
  };
}
