import { Alliance, FetchBallPreference, MatchType, TowerStatus } from '../scouting.entity';
import {
  IsDefined,
  IsEnum,
  IsInt,
  IsString,
  IsOptional,
  Min,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export class Autonomous {
  @IsInt()
  @Min(0)
  autoStart: number;

  @IsBoolean()
  leftStartingZone: boolean;

  @IsInt()
  @Min(0)
  fuelCount: number;

  @IsBoolean()
  isTowerSuccess: boolean;
}

export class Teleop {
  @IsInt()
  @Min(0)
  fuelCount: number;

  @IsInt()
  @Min(0)
  humanFuelCount: number;

  @IsBoolean()
  passBump: boolean;

  @IsBoolean()
  passTrench: boolean;

  @IsEnum(FetchBallPreference)
  @IsOptional()
  fetchBallPreference: FetchBallPreference;
}

export class EndAndAfterGame {
  @IsEnum(TowerStatus)
  towerStatus: TowerStatus;

  @IsString()
  @IsOptional()
  comments: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  climbingTime: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  rankingPoint: number;

  @IsBoolean()
  @IsOptional()
  coopPoint: boolean;

  @IsBoolean()
  @IsOptional()
  autonomousMove: boolean;

  @IsBoolean()
  @IsOptional()
  teleopMove: boolean;
}

export class CreateTeamRecordDto {
  @IsEnum(MatchType)
  matchType: MatchType;

  @IsInt()
  @Min(0)
  matchNumber: number;

  @IsEnum(Alliance)
  alliance: Alliance;

  @IsInt()
  @Min(1)
  team: number;

  @ValidateNested()
  @Type(() => Autonomous)
  @IsDefined()
  autonomous: Autonomous;

  @ValidateNested()
  @IsDefined()
  @Type(() => Teleop)
  teleop: Teleop;

  @ValidateNested()
  @IsDefined()
  @Type(() => EndAndAfterGame)
  endAndAfterGame: EndAndAfterGame;
}
