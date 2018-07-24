import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

@Entity()
@ObjectType()
export class User {
  @ObjectIdColumn()
  @Field(type => ID)
  public id!: ObjectID;

  @Column({ unique: true })
  @Field()
  public email!: string;

  @Column()
  public password!: string;
}
