import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
export class User {
  // tslint:disable-next-line:variable-name | We need to access the mongo instance id.
  public _id!: string;

  @Field(type => ID)
  public get id(): string {
    return this._id;
  }

  @Field()
  public email!: string;

  public password!: string;
}
