import { Role } from '../../common/constants/roles.js';

export interface LoginBody {
  email: string;
  password: string;
}

export interface TokenPayload {
  id: string;
  role: Role;
}
