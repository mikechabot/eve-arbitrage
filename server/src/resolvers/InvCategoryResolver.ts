import { Arg, Query, Resolver } from 'type-graphql';
import { InvCategory } from '../entities/InvCategory';

@Resolver()
export class InvCategoryResolver {
  @Query(() => [InvCategory])
  categories(): Promise<InvCategory[]> {
    // return InvCategory.find({ relations: ['groups'] });
    return InvCategory.find();
  }

  @Query(() => InvCategory, { nullable: true })
  /**
   * Arg can be anything we want, as it will be exposed to the GraphQL
   * endpoint. If we changed "id" to "identifier", we'd query GraphQL
   * like the following:
   *
   * {
   *   InvCategory(identifier: 4) {
   *     id,
   *     categoryName
   *   }
   * }
   *
   * @param categoryId
   */
  category(@Arg('categoryId') categoryId: number): Promise<InvCategory | undefined> {
    // return InvCategory.findOne({ categoryId }, { relations: ['groups'] });
    return InvCategory.findOne({ categoryId });
  }
}
