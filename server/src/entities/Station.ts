import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';

@Entity({ name: 'Station' })
export class Station extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  stationId: number;

  /**
   * https://stackoverflow.com/questions/57391545/queryfailederror-invalid-input-syntax-for-integer-when-querying-on-type-floa
   */
  @Column({ type: 'real' })
  security: string;

  @Column()
  stationName: string;

  @Column({nullable: true})
  isNpc: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
