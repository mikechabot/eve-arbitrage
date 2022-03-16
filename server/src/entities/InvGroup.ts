import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  BaseEntity,
} from 'typeorm';

import { InvCategory } from 'src/entities/InvCategory';
import { InvType } from 'src/entities/InvType';

@Entity({ name: 'InvGroup' })
export class InvGroup extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  groupId: number;

  @Column()
  categoryId: number;

  @Column()
  groupName: string;

  @ManyToOne(() => InvCategory)
  @JoinColumn({
    name: 'categoryId',
    referencedColumnName: 'categoryId',
  })
  category: InvCategory;

  @OneToMany(() => InvType, (type) => type.group, { cascade: ['insert'] })
  types: InvType[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
