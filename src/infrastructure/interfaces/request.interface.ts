import { Request } from 'express';
import { UserRoleEnum } from '../enums/user-role.enum';

export interface RequestInterface extends Request {
  traceId: string;
  user: {
    id: string;
    role: UserRoleEnum;
  };
}
