import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';

/**
 * This allows us to use the entity in GraphQL
 */
import { Field, ObjectType, Int } from 'type-graphql';

import { InvCategory } from './InvCategory';
import { InvType } from './InvType';

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

  @Field(() => [InvType])
  @OneToMany(() => InvType, (type) => type.group)
  types: InvType[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
