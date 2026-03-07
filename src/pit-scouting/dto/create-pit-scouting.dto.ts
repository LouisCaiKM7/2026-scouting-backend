import { IsString, IsNumber, IsArray, IsObject, IsBoolean, IsOptional } from 'class-validator';

class Capabilities {
  @IsBoolean()
  towerL1: boolean;

  @IsBoolean()
  towerL2: boolean;

  @IsBoolean()
  towerL3: boolean;

  @IsNumber()
  fuelStorageAbility: number;
}

export class CreatePitScoutingDto {
  @IsString()
  autoType: string;

  @IsObject()
  capabilities: Capabilities;

  @IsString()
  chassisType: string;

  @IsArray()
  @IsString({ each: true })
  photos: string[];

  @IsNumber()
  teamNumber: string;

  @IsString()
  @IsOptional()
  comments?: string;
}
