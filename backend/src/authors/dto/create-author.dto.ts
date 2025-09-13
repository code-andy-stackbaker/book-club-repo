// Keep create surface tight: name required; bio optional.
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAuthorDto {
  @ApiProperty({ example: 'J.R.R. Tolkien' })
  @IsString()
  @MaxLength(120)
  name!: string;

  @ApiProperty({ example: 'English writer and professor', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  bio?: string;
}