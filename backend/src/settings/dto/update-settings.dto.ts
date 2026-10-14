import { IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  welcomePrompt?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  recordPrompt?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  invalidOptionPrompt?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  goodbyePrompt?: string;

  @IsOptional()
  @IsInt()
  @Min(10)
  @Max(300)
  maxRecordingSeconds?: number;
}
