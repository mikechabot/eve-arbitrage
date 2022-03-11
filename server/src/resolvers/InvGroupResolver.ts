import { Arg, Query, Resolver } from 'type-graphql';

import { InvGroup } from 'src/entities/InvGroup';

@Resolver()
export class InvGroupResolver {
  @Query(() => [InvGroup])
  groups(): Promise<InvGroup[]> {
    // return InvGroup.find({ relations: ['category', 'types'] });
    return InvGroup.find();
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
   * @param groupId
   */
  group(@Arg('groupId') groupId: number): Promise<InvGroup | undefined> {
    // return InvGroup.findOne({ groupId }, { relations: ['category', 'types'] });
    return InvGroup.findOne({ groupId });
  }
}
