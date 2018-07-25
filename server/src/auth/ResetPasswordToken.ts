import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

import { User } from '../user/User';

@Entity()
export class ResetPasswordToken {
  @PrimaryColumn({ unique: true })
  public readonly token!: string;

  @Column()
  public readonly validUntil!: number;

  @ManyToOne(type => User, user => user.resetPasswordTokens, { eager: true })
  public readonly user!: User;
}
