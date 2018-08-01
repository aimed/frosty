import { ArgsType, Field, Int, ObjectType } from 'type-graphql';

import { ClassType } from 'type-graphql/decorators/types';

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

// export function createConnectionEdge<T extends new() => any>(
//   prefix: string, typeThunk: () => T,
// ) {
//   @ObjectType(prefix + 'ConnectionEdge') class RConnectionEdge<T> {
//     @Field()
//     public cursor!: string;

//     @Field(typeThunk)
//     public node!: T;
//   }

//   return RConnectionEdge;
// }

// export function createConnection<T extends new() => any>(
//   prefix: string, typeThunk: () => T,
// ) {
//   // tslint:disable-next-line:variable-name
//   const EdgeType = createConnectionEdge(prefix, typeThunk);
//   type EdgeTypeType = typeof EdgeType;

//   @ObjectType()
//   class RConnection {
//     @Field(type => [typeThunk()])
//     public edges!: EdgeTypeType[];

//     @Field(type => PageInfo)
//     public pageInfo!: PageInfo;
//   }
//   return RConnection;
// }
