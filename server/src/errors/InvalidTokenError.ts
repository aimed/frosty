import { ServerError } from './ServerError';

export class InvalidTokenError extends ServerError {
  public constructor() {
    super(
      InvalidTokenError.name,
      'The access token provided is expired, revoked, malformed, or invalid for other reasons.',
      401,
    );
  }
}
