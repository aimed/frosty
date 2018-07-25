import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '../user/User';

@Entity()
export class ResetPasswordToken {
  @PrimaryGeneratedColumn('uuid')
  public readonly id!: string;

  @Column()
  public readonly validUntil!: number;

  @ManyToOne(type => User, user => user.resetPasswordTokens, { eager: true })
  public readonly user!: User;
}
