import {
  Entity,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  Column,
} from 'typeorm';
import { User } from './user.entity';

@Entity('ratings')
export class Ratings extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 0 })
  score: number;

  @ManyToOne(() => User, (user) => user.givenRatings, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => User, (user) => user.receivedRatings, {
    onDelete: 'CASCADE',
  })
  store: User;
}
