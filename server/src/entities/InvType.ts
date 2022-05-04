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

class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseFloat(data);
  }
}

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

  @Column({type: 'numeric', nullable: false,  transformer: new ColumnNumericTransformer()})
  volume: number;

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
