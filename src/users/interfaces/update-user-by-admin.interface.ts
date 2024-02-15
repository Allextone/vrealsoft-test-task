import { UserRoleEnum } from '../../infrastructure/enums/user-role.enum';

export interface UpdateUserByAdminInterface {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  role?: UserRoleEnum;
  isCanCreateNotes?: boolean;
}
