import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

/**
 * This allows us to use the entity in GraphQL
 */
import { Field, ObjectType, Int } from 'type-graphql';

import { InvCategory } from './InvCategory';

@ObjectType()
@Entity({ name: 'InvGroup' })
export class InvGroup extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  groupId: number;

  @Field()
  @Column()
  categoryId: number;

  @Field()
  @Column()
  groupName: string;

  @Field()
  @ManyToOne(() => InvCategory)
  @JoinColumn({
    name: 'categoryId',
    referencedColumnName: 'categoryId',
  })
  category: InvCategory;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
