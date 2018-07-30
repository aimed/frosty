import { AddIngredientArgs, FridgeResolver } from '../FridgeResolver';

import { Connection } from '../../../node_modules/typeorm';
import { Container } from '../../../node_modules/typedi';
import { Fridge } from '../Fridge';
import { FridgeIngredient } from '../FridgeIngredient';
import { Ingredient } from '../../ingredient/Ingredient';
import { createTestConnection } from '../../__tests__/createTestConnection';
import { createTestUser } from '../../__tests__/createTestUser';
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

  it('should manually be able to create a fridge ingredient', async () => {
    const user = await createTestUser();
    const fridge = await user.fridge;

    const name = getDeterministicString();
    const unit = 'g';
    const ingredients = connection.getRepository(Ingredient);
    const ingredient = await ingredients.save(ingredients.create({ name, unit }));

    expect(ingredient).toBeTruthy();
    expect(user).toBeTruthy();
    expect(fridge).toBeTruthy();

    const amount = 1;
    const fridgeIngredients = connection.getRepository(FridgeIngredient);

    const fridgeIngredient = fridgeIngredients.create({ amount });
    fridgeIngredient.fridge = Promise.resolve(fridge);
    fridgeIngredient.ingredient = Promise.resolve(ingredient);
    await fridgeIngredients.save(fridgeIngredient);

    const fridgeContents = await fridge.ingredients;
    expect(fridgeContents.length).toBeTruthy();
    const first = fridgeContents[0];
    await fridgeIngredients.preload(first);
    expect(first).toBeTruthy();
    expect(first.amount).toEqual(amount);
    expect(first.ingredient).toBeTruthy();
  });

  it('should create an non existing ingredient', async () => {
    const user = await createTestUser();
    const fridge = await user.fridge;
    expect(user).toBeTruthy();
    expect(fridge).toBeTruthy();

    const name = getDeterministicString();
    const unit = 'g';
    const amount = 1;
    const args = { name, unit, amount } as AddIngredientArgs;
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
    console.log(firstQueried);
    expect(firstQueried).toBeTruthy();
    expect(firstQueried.ingredient).toBeTruthy();
  });
});
