import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class AccessToken {
  // tslint:disable-next-line:variable-name
  public readonly _id!: string;
  public readonly userId!: string;

  @Field()
  public readonly token!: string;

  @Field({ description: 'Date until the token is valid in UTC ms.' })
  public readonly validUntil!: number;
}
