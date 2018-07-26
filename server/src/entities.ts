import { AccessToken } from './auth/AccessToken';
import { PasswordResetToken } from './auth/PasswordResetToken';
import { User } from './user/User';

/**
 * All entities registered with TypeORM.
 * Simplifies creating connections in test and production.
 */
export function getEntities() {
  return [
    User,
    AccessToken,
    PasswordResetToken,
  ];
}
