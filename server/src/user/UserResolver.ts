import { Authorized, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql';

import { Context } from '../graphql/Context';
import { Fridge } from '../fridge/Fridge';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ROLES } from './Role';
import { Repository } from 'typeorm';
import { Service } from 'typedi';
import { User } from './User';

@Service()
@Resolver(User)
export class UserResolver {
  @InjectRepository(User)
  private readonly userRepo!: Repository<User>;

  public constructor() {}

  @Authorized(ROLES.guest)
  @Query(() => User, { nullable: true, description: 'The currently authenticated user.' })
  public viewer(@Ctx() context: Context): User | null {
    return context.user || null;
  }

  @FieldResolver()
  public async fridge(@Root() user: User) {
    const fridge = await user.fridge;
    if (!fridge) {
      user.fridge = Promise.resolve(new Fridge());
      await this.userRepo.save(user);
    }
    return user.fridge;
  }
}
