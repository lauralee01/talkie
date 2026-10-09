import { IsOptional, IsString } from 'class-validator';

export class BandwidthMenuDto {
  @IsOptional()
  @IsString()
  digits?: string;
}
