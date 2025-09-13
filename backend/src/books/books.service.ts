// Service keeps validation close to the DB to avoid racey FK errors.
// If authorId doesn't exist, return a plain 400 rather than a cryptic DB error.
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  // For list screens it's handy to include the author right away.
  findAll() {
    return this.prisma.book.findMany({
      include: { author: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: { author: true },
    });
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async create(dto: CreateBookDto) {
    const author = await this.prisma.author.findUnique({ where: { id: dto.authorId } });
    if (!author) throw new BadRequestException('authorId does not reference an existing author');
    return this.prisma.book.create({ data: dto });
  }

  async update(id: string, dto: UpdateBookDto) {
    if (dto.authorId) {
      const author = await this.prisma.author.findUnique({ where: { id: dto.authorId } });
      if (!author) throw new BadRequestException('authorId does not reference an existing author');
    }
    try {
      return await this.prisma.book.update({ where: { id }, data: dto });
    } catch {
      throw new NotFoundException('Book not found');
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.book.delete({ where: { id } });
      return { deleted: true };
    } catch {
      throw new NotFoundException('Book not found');
    }
  }
}