import { Connection } from 'typeorm';
import { Container } from 'typedi';
import { Fridge } from '../fridge/Fridge';
import { ShoppingList } from '../shoppinglist/ShoppingList';
import { User } from '../user/User';
import { getDeterministicString } from './getDeterministicString';

export async function createNewTestUser(connection: Connection = Container.get(Connection)) {
  if (!process.env.PASSWORDS_PEPPER) {
    process.env.PASSWORDS_PEPPER = 'PASSWORDS_PEPPER';
  }

  const users = connection.getRepository(User);
  const email = getDeterministicString() + '@example.com';
  const password = await User.hashPassword('password');
  const user = users.create({ email, password });
  user.fridge = Promise.resolve(new Fridge());
  user.shoppingList = Promise.resolve(new ShoppingList());

  await users.save(user);
  return user;
}
