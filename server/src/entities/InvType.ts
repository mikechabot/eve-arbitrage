import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  BaseEntity,
} from 'typeorm';

/**
 * This allows us to use the entity in GraphQL
 */
import { Field, ObjectType, Int } from 'type-graphql';

import { InvGroup } from './InvGroup';

@ObjectType()
@Entity({ name: 'InvType' })
export class InvType extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  typeId: number;

  @Field()
  @Column()
  groupId: number;

  @Field()
  @Column()
  typeName: string;

  @Field()
  @ManyToOne(() => InvGroup)
  @JoinColumn({
    name: 'groupId',
    referencedColumnName: 'groupId',
  })
  group: InvGroup;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
