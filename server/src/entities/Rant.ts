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
@Entity({ name: 'rants' })
export class Rant extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @Column()
  text: string;

  @Field()
  @Column()
  emotion: string;

  @Field()
  @Column({ nullable: true })
  tripcode: string;

  @Field()
  @Column({ default: false })
  allowComments: boolean;

  @Field()
  @Column({ nullable: true })
  hash: string;
}
