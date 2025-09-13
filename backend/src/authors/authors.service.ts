// Prisma-backed CRUD with clear 404s rather than leaking DB internals.
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@Injectable()
export class AuthorsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.author.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const author = await this.prisma.author.findUnique({ where: { id } });
    if (!author) throw new NotFoundException('Author not found');
    return author;
  }

  create(dto: CreateAuthorDto) {
    return this.prisma.author.create({ data: dto });
  }

  async update(id: string, dto: UpdateAuthorDto) {
    try {
      return await this.prisma.author.update({ where: { id }, data: dto });
    } catch {
      throw new NotFoundException('Author not found');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.author.delete({ where: { id } });
      return { deleted: true };
    } catch {
      throw new NotFoundException('Author not found');
    }
  }
}