import { Arg, Query, Resolver } from 'type-graphql';
import { InvGroup } from '../entities/InvGroup';

@Resolver()
export class InvGroupResolver {
  @Query(() => [InvGroup])
  groups(): Promise<InvGroup[]> {
    return InvGroup.find({ relations: ['category'] });
  }

  @Query(() => InvGroup, { nullable: true })
  /**
   * Arg can be anything we want, as it will be exposed to the GraphQL
   * endpoint. If we changed "id" to "identifier", we'd query GraphQL
   * like the following:
   *
   * {
   *   InvGroup(identifier: 4) {
   *     id,
   *     groupName
   *   }
   * }
   *
   * @param id
   */
  group(@Arg('id') id: number): Promise<InvGroup | undefined> {
    return InvGroup.findOne(id, { relations: ['category'] });
  }
}
