import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';

@Entity({ name: 'OAuthToken' })
export class OAuthToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  characterId: number;

  @Column()
  access_token: string;

  @Column()
  token_type: string;

  @Column()
  refresh_token: string;

  @Column()
  expires_in: number;

  @Column()
  isValid: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
