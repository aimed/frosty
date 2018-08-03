import { ArgsType, Field, Int, ObjectType } from 'type-graphql';

import { TypeValue } from 'type-graphql/decorators/types';

@ArgsType()
export class ConnectionArgs {
  @Field(type => Int, { nullable: true })
  public readonly first: number = 10;

  // TODO: Should be a cursor.
  @Field({ nullable: true })
  public readonly after: number = 0;

  // TODO: Add last | before for backwards pagination
}

@ObjectType()
export class PageInfo {
  @Field()
  public hasNextPage!: boolean;
}

@ObjectType()
export abstract class Edge<T> {
  @Field()
  public cursor!: string;

  abstract node: T;
}

@ObjectType()
export abstract class Connection<T> {
  @Field()
  public pageInfo!: PageInfo;

  abstract edges: Edge<T>[];
}
