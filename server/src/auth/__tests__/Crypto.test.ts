import { Crypto } from '../Crypto';

beforeAll(() => {
  process.env.PASSWORDS_PEPPER = 'A_RANDOM_KEY';
});

describe(`${Crypto.name} `, async () => {
  const plaintext = 'my_super_secure_password';

  it('hashes a password ', async () => {
    const hashed = await Crypto.hashPassword(plaintext);
  });

  it('verifies a correct password ', async () => {
    const hashed = await Crypto.hashPassword(plaintext);
    const isCorrect = await Crypto.isPasswordCorrect(plaintext, hashed);
    expect(isCorrect).toBeTruthy();
  });

  it('does not verify an incorrect password ', async () => {
    const plaintextFaulty = plaintext + '_fauly';
    const hashed = await Crypto.hashPassword(plaintext);
    const isCorrect = await Crypto.isPasswordCorrect(plaintextFaulty, hashed);
    expect(isCorrect).toBeFalsy();
  });
});
