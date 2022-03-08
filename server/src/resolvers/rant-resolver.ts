import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { Rant } from '../entities/Rant';

@Resolver()
export class RantResolver {
  @Query(() => [Rant])
  rants(): Promise<Rant[]> {
    return Rant.find();
  }

  @Query(() => Rant, { nullable: true })
  /**
   * Arg can be anything we want, as it will be exposed to the GraphQL
   * endpoint. If we changed "id" to "identifer", we'd query GraphQL
   * like the following:
   *
   * {
   *   rant(identifier: 4) {
   *     id,
   *     text
   *   }
   * }
   *
   * @param id
   */
  rant(@Arg('id') id: number): Promise<Rant | undefined> {
    return Rant.findOne(id);
  }

  @Mutation(() => Rant)
  create(@Arg('text') text: string, @Arg('emotion') emotion: string): Promise<Rant> {
    return Rant.create({ text, emotion }).save();
  }
}
