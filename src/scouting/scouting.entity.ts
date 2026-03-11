import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Team } from '../team/team.entity';
import { TBAEvent } from '../tba/tba-event.entity';
import { TBAMatch } from '../tba/tba-match.entity';
import { ScoutEvent } from '../event/scout-event.entity';
import { EventMatch } from '../event/event-match.entity';

export enum MatchType {
  QUAL = 'Qualification',
  PRAC = 'Practice',
  MATCH = 'Match',
  FINAL = 'Final',
}

export enum Alliance {
  RED = 'Red',
  BLUE = 'Blue',
}

export enum FetchBallPreference {
  DEPOT = 'Depot',
  OUTPOST_CHUTE = 'Outpost Chute',
  NEUTRAL_ZONE = 'Neutral Zone',
}

export enum TowerStatus {
  NONE = 'None',
  L1 = 'L1',
  L2 = 'L2',
  L3 = 'L3',
}

export class Autonomous {
  @Column('int', { name: 'autoStart' })
  autoStart: number;

  @Column({ nullable: true })
  leftStartingZone: boolean;

  @Column({ default: 0 })
  fuelCount: number;

  @Column({ default: false })
  isTowerSuccess: boolean;
}

export class Teleop {
  @Column({ default: 0 })
  fuelCount: number;

  @Column({ default: 0 })
  humanFuelCount: number;

  @Column({ default: false })
  passBump: boolean;

  @Column({ default: false })
  passTrench: boolean;

  @Column({
    type: 'enum',
    enum: FetchBallPreference,
    nullable: true,
  })
  fetchBallPreference: FetchBallPreference;
}

export class EndAndAfterGame {
  @Column({
    type: 'enum',
    enum: TowerStatus,
    default: TowerStatus.NONE,
  })
  towerStatus: TowerStatus;

  @Column({ nullable: true })
  comments: string;

  @Column({ nullable: true })
  climbingTime: number;

  @Column({ nullable: true })
  rankingPoint: number;

  @Column({ nullable: true })
  coopPoint: boolean;

  @Column({ nullable: true })
  autonomousMove: boolean;

  @Column({ nullable: true })
  teleopMove: boolean;
}

@Entity()
export class TeamMatchRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ScoutEvent, (event) => event.matchRecords, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'scoutEventId' })
  scoutEvent: ScoutEvent;

  @Column({ nullable: true })  // 临时允许 null 以完成迁移
  scoutEventId: string;

  @ManyToOne(() => EventMatch, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'eventMatchId' })
  eventMatch: EventMatch;

  @Column({ nullable: true })
  eventMatchId: string;

  // NEW: Link to TBA Event
  @ManyToOne(() => TBAEvent, (event) => event.scoutingRecords, {
    nullable: true,
  })
  @JoinColumn({ name: 'eventKey' })
  event: TBAEvent;

  @Column({ nullable: true })
  eventKey: string;

  // NEW: Link to TBA Match
  @ManyToOne(() => TBAMatch, (match) => match.scoutingRecords)
  @JoinColumn({ name: 'matchKey' })
  tbaMatch: TBAMatch;

  @Column({ nullable: true })
  matchKey: string;

  @Column({
    type: 'enum',
    enum: MatchType,
  })
  matchType: MatchType;

  @Column()
  matchNumber: number;

  @Column({
    type: 'enum',
    enum: Alliance,
  })
  alliance: Alliance;

  @Column(() => Autonomous)
  autonomous: Autonomous;

  @Column(() => Teleop)
  teleop: Teleop;

  @Column(() => EndAndAfterGame)
  endAndAfterGame: EndAndAfterGame;

  @ManyToOne(() => Team, (team) => team.matchRecords)
  team: Team;

  @ManyToOne(() => User, (user) => user.matchRecords)
  user: User;
}
