import 'reflect-metadata';

import { Collection, Db, MongoClient } from 'mongodb';
import { Container, Service } from 'typedi';

import { MongoCollection } from '../MongoCollection';

describe(`${MongoCollection.name} `, () => {
  let connection: any;
  let db: any;

  beforeAll(async () => {
    connection = await MongoClient.connect((global as any).__MONGO_URI__);
    db = await connection.db((global as any).__MONGO_DB_NAME__);
    Container.set(Db, db);
  });

  afterAll(async () => {
    await connection.close();
    await db.close();
  });

  // tslint:disable-next-line:ter-prefer-arrow-callback
  it('can inject a collection with the correct name ', function injectCollection() {
    const serviceInstance = Container.get(TestService);
    expect(serviceInstance).toBeTruthy();
    expect(serviceInstance.collection).toBeTruthy();
    expect(serviceInstance.collection.collectionName).toEqual(TestType.name);
  });
});

class TestType {
  // tslint:disable-next-line:variable-name
  public readonly _id!: string;
}

@Service()
class TestService {
  constructor(
    @MongoCollection(of => TestType)
    public readonly collection: Collection<TestType>,
  ) {}
}
