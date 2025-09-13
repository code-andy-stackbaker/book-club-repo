import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './health/health.module';
import { AuthorsModule } from './authors'; // from Phase 3 barrel
import { BooksModule } from './books';     // new barrel import

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    AuthorsModule,
    BooksModule,
  ],
})
export class AppModule {}