// Thin controller: validate + delegate. PrismaExceptionFilter maps DB errors cleanly.
import { Body, Controller, Delete, Get, Param, Patch, Post, UseFilters } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { PrismaExceptionFilter } from '../common/filters/prisma-exception.filter';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('authors')
@UseFilters(PrismaExceptionFilter)
@Controller('authors')
export class AuthorsController {
  constructor(private readonly service: AuthorsService) {}

  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(id); }
  @Post() create(@Body() dto: CreateAuthorDto) { return this.service.create(dto); }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateAuthorDto) { return this.service.update(id, dto); }
  @Delete(':id') remove(@Param('id') id: string) { return this.service.remove(id); }
}