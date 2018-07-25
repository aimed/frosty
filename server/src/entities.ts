import { AccessToken } from './auth/AccessToken';
import { ResetPasswordToken } from './auth/ResetPasswordToken';
import { User } from './user/User';

export function getEntities() {
  return [
    User,
    AccessToken,
    ResetPasswordToken,
  ];
}
