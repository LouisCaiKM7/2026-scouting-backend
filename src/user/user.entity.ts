import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TeamMatchRecord } from '../scouting/scouting.entity';
import { PitScouting } from 'src/pit-scouting/pit-scouting.entity';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
  })
  roles: Role[];

  @OneToMany(() => TeamMatchRecord, (record) => record.user)
  matchRecords: TeamMatchRecord[];

  @OneToMany(() => PitScouting, (pitScouting) => pitScouting.user)
  pitScouting: PitScouting[];
}
