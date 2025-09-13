// Create surface: title and authorId are required.
// Year is intentionally loose (0..9999) to avoid timezone/library debates.
import { IsInt, IsOptional, IsString, IsUUID, Max, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ example: 'The Hobbit' })
  @IsString()
  @MaxLength(200)
  title!: string;

  @ApiProperty({ example: 'author-uuid' })
  @IsUUID()
  authorId!: string;

  @ApiProperty({ required: false, example: 'Short blurb about the book' })
  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description?: string;

  @ApiProperty({ required: false, example: 1937 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(9999)
  publishedYear?: number;
}