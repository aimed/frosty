import { Connection } from 'typeorm';
import { Container } from 'typedi';
import { Fridge } from '../fridge/Fridge';
import { User } from '../user/User';
import { getDeterministicString } from './getDeterministicString';

export async function createTestUser(connection: Connection = Container.get(Connection)) {
  if (!process.env.PASSWORDS_PEPPER) {
    process.env.PASSWORDS_PEPPER = 'PASSWORDS_PEPPER';
  }

  const users = connection.getRepository(User);
  const email = getDeterministicString() + '@example.com';
  const password = await User.hashPassword('password');
  const user = users.create({ email, password });

  const fridges = connection.getRepository(Fridge);
  const fridge = await fridges.save(fridges.create());
  user.fridge = Promise.resolve(fridge);

  await users.save(user);
  return user;
}
