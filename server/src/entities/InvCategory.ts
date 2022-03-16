import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BaseEntity,
} from 'typeorm';

import { InvGroup } from 'src/entities/InvGroup';

@Entity({ name: 'InvCategory' })
export class InvCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  categoryId: number;

  @Column()
  categoryName: string;

  @OneToMany(() => InvGroup, (group) => group.category, { cascade: ['insert'] })
  groups: InvGroup[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
