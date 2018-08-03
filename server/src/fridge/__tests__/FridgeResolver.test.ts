import 'reflect-metadata';

import { Connection } from 'typeorm';
import { Container } from 'typedi';
import { FridgeResolver } from '../FridgeResolver';
import { Ingredient } from '../../ingredient/Ingredient';
import { createNewTestUser } from '../../__tests__/createTestUser';
import { createTestConnection } from '../../__tests__/createTestConnection';
import { getDeterministicString } from '../../__tests__/getDeterministicString';

describe(FridgeResolver.name, () => {
  let connection: Connection;
  let resolver: FridgeResolver;

  beforeAll(async () => {
    connection = await createTestConnection();
    resolver = Container.get(FridgeResolver);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should create an non existing ingredient', async () => {
    const user = await createNewTestUser();
    const fridge = await user.fridge;
    expect(user).toBeTruthy();
    expect(fridge).toBeTruthy();

    const name = getDeterministicString();
    const unit = 'g';
    const amount = 1;
    const args = { name, unit, amount };
    const response = await resolver.addIngredient(user, args);
    expect(response).toBeTruthy();
    expect(response.user).toBeTruthy();
    expect(response.user.id).toEqual(user.id);

    expect(response.ingredient).toBeTruthy();
    expect(response.ingredient.amount).toEqual(amount);
    expect(response.ingredient.ingredient).toBeTruthy();
    const fridgeIngredientIngredient = await response.ingredient.ingredient;
    expect(fridgeIngredientIngredient.id).toBeTruthy();
    expect(fridgeIngredientIngredient.unit).toEqual(unit);
    expect(fridgeIngredientIngredient.name).toEqual(name);

    const ingredient = await connection.getRepository(Ingredient).findOne({ name, unit });
    expect(ingredient).toBeTruthy();

    const allIngredients = await fridge.ingredients;
    expect(allIngredients.length).toBeTruthy();
    const firstQueried = allIngredients[0];
    expect(firstQueried).toBeTruthy();
    expect(firstQueried.ingredient).toBeTruthy();
  });

  it('should not create an ingredient again', async () => {
    const name = getDeterministicString();
    const unit = 'g';
    const one = await resolver.findOrCreateIngredient(name, unit);
    const two = await resolver.findOrCreateIngredient(name, unit);
    expect(one).toBeTruthy();
    expect(two).toBeTruthy();
    expect(one.id).toEqual(two.id);
  });

  it('should not add an ingredient to a fridge again', async () => {
    const user = await createNewTestUser();
    const fridge = await user.fridge;
    const name = getDeterministicString();
    const unit = 'g';
    const ingredient = await resolver.findOrCreateIngredient(name, unit);
    const one = await resolver.findOrCreateFridgeIngredient(ingredient, fridge);
    const two = await resolver.findOrCreateFridgeIngredient(ingredient, fridge);
    expect(one).toBeTruthy();
    expect(two).toBeTruthy();
    expect(one.id).toEqual(two.id);
  });

  it('should add to an existing ingredient', async () => {
    const user = await createNewTestUser();
    const fridge = await user.fridge;
    expect(user).toBeTruthy();
    expect(fridge).toBeTruthy();

    const name = getDeterministicString();
    const unit = 'g';
    const amount = 1;
    const args = { name, unit, amount };
    // Add it twice
    const response1 = await resolver.addIngredient(user, args);
    const response2 = await resolver.addIngredient(user, args);
    const ingredient1 = await response1.ingredient.ingredient;
    const ingredient2 = await response2.ingredient.ingredient;
    expect(ingredient1).toEqual(ingredient2);

    const fridgeIngredients = await fridge.ingredients;
    expect(fridgeIngredients.length).toEqual(1);
    expect(fridgeIngredients[0].amount).toEqual(2);
  });
});
