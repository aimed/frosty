import { Container } from 'typedi';
import { Db } from 'mongodb';

/**
 * Property decorator for TypeDI to inject a mongo collection.
 * @param typeThunk Function that returns the class for which to return the collection.
 *                  Example:
 *                  @MongoCollection(of => User) private readonly userCollection: Collection<User>()
 */
// tslint:disable-next-line:variable-name | Property decoratos sbould be capitalized.
export const MongoCollection =
  (typeThunk: (nothing?: undefined) => { name: string }) =>
  (object: Object, propertyName: string, index?: number) => {
    Container.registerHandler({
      object,
      propertyName,
      index,
      value: () => Container.get(Db).collection(typeThunk().name),
    });
  };
