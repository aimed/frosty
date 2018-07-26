import { Security } from '../Security';

beforeAll(() => {
  process.env.PASSWORDS_PEPPER = 'A_RANDOM_KEY';
});

describe(`${Security.name} `, async () => {
  const plaintext = 'my_super_secure_password';

  it('hashes a password ', async () => {
    const hashed = await Security.hashPassword(plaintext);
  });

  it('verifies a correct password ', async () => {
    const hashed = await Security.hashPassword(plaintext);
    const isCorrect = await Security.isPasswordCorrect(plaintext, hashed);
    expect(isCorrect).toBeTruthy();
  });

  it('does not verify an incorrect password ', async () => {
    const plaintextFaulty = plaintext + '_fauly';
    const hashed = await Security.hashPassword(plaintext);
    const isCorrect = await Security.isPasswordCorrect(plaintextFaulty, hashed);
    expect(isCorrect).toBeFalsy();
  });
});
