import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';

/**
 * This allows us to use the entity in GraphQL
 */
import { Field, ObjectType, Int } from 'type-graphql';

@ObjectType()
@Entity({ name: 'InvCategory' })
export class InvCategory extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  categoryId: number;

  @Field()
  @Column()
  categoryName: string;

  // @Field(() => [InvGroup])
  // @OneToMany(() => InvGroup, (group) => group.category)
  // groups: InvGroup[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
