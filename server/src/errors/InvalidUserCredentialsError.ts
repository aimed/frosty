import { ServerError } from './ServerError';

export class InvalidUserCredentialsError extends ServerError {
  public constructor() {
    super(
      InvalidUserCredentialsError.name,
      'Invalid email or password.',
      401,
    );
  }
}
