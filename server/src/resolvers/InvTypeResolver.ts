import { Arg, Query, Resolver } from 'type-graphql';
import { InvType } from '../entities/InvType';

@Resolver()
export class InvTypeResolver {
  @Query(() => [InvType])
  types(): Promise<InvType[]> {
    return InvType.find({ relations: ['group', 'group.category'] });
  }

  @Query(() => InvType, { nullable: true })
  /**
   * Arg can be anything we want, as it will be exposed to the GraphQL
   * endpoint. If we changed "id" to "identifier", we'd query GraphQL
   * like the following:
   *
   * {
   *   InvType(identifier: 4) {
   *     id,
   *     typeName
   *   }
   * }
   *
   * @param typeId
   */
  type(@Arg('typeId') typeId: number): Promise<InvType | undefined> {
    return InvType.findOne({ typeId }, { relations: ['group', 'group.category'] });
  }
}
