import * as crypto from 'crypto';

/**
 * Gets a random string that is deterministic based on the call stack.
 */
export function getDeterministicString(): string {
  const stack = new Error().stack!;
  const hash = crypto.createHash('md5').update(stack).digest('hex');
  return hash;
}
