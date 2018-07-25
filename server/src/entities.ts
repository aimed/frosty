import { AccessToken } from './auth/AccessToken';
import { ResetPasswordToken } from './auth/ResetPasswordToken';
import { User } from './user/User';

/**
 * All entities registered with TypeORM.
 * Simplifies creating connections in test and production.
 */
export function getEntities() {
  return [
    User,
    AccessToken,
    ResetPasswordToken,
  ];
}
