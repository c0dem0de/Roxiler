import { Roles } from 'src/constants';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { Ratings } from './ratings.entity';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 60 })
  name: string;

  @Column({ length: 400, nullable: true })
  address: string;

  @Column({ select: false })
  password: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: Roles.USER })
  role: string;

  @OneToMany(() => Ratings, (rating) => rating.user)
  givenRatings: Ratings[];

  @OneToMany(() => Ratings, (rating) => rating.store)
  receivedRatings: Ratings[];
}
