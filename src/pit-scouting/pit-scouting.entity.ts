import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Team } from '../team/team.entity';

@Entity()
export class PitScouting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  autoType: string;

  @Column('json')
  capabilities: {
    towerL1: boolean;
    towerL2: boolean;
    towerL3: boolean;
    fuelStorageAbility: number;
  };

  @Column()
  chassisType: string;

  @Column('simple-array')
  photos: string[];

  @Column({ nullable: true, type: 'text' })
  comments?: string;

  @ManyToOne(() => User, (user) => user.pitScouting)
  user: User;

  @OneToOne(() => Team, (team) => team.pitScouting)
  @JoinColumn()
  team: Team;
}
