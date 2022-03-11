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
@Entity({ name: 'AuthToken' })
export class AuthToken extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  access_token: string;

  @Field()
  @Column()
  token_type: string;

  @Field()
  @Column()
  refresh_token: string;

  @Field()
  @Column()
  expires_in: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
