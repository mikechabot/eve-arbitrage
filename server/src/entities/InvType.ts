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

import { InvGroup } from './InvGroup';

@Entity({ name: 'InvType' })
export class InvType extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  typeId: number;

  @Column()
  groupId: number;

  @Column()
  typeName: string;

  @ManyToOne(() => InvGroup)
  @JoinColumn({
    name: 'groupId',
    referencedColumnName: 'groupId',
  })
  group: InvGroup;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
