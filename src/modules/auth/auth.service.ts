import jwt from 'jsonwebtoken';
import { User } from '../user/user.model.js';
import { ApiError } from '../../common/utils/ApiError.js';
import { HTTP } from '../../common/constants/httpStatus.js';
import { env } from '../../config/env.js';
import { LoginBody, TokenPayload } from './auth.types.js';

export const login = async (body: LoginBody) => {
  const user = await User.findOne({ email: body.email, isActive: true }).select('+password');
  if (!user || !(await user.comparePassword(body.password))) {
    throw new ApiError(HTTP.UNAUTHORIZED, 'Invalid email or password');
  }

  const payload: TokenPayload = { id: String(user._id), role: user.role };
  const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as any });

  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    accessToken,
  };
};

export const getMe = async (userId: string) => {
  const user = await User.findById(userId).select('-__v');
  if (!user) throw new ApiError(HTTP.NOT_FOUND, 'User not found');
  return user;
};
