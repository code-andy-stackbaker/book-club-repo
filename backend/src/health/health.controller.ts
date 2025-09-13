// Liveness is process-up; readiness touches the DB to catch dependency issues.
import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller()
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('healthz')
  liveness() {
    return { ok: true };
  }

  @Get('readyz')
  async readiness() {
    await this.prisma.$queryRaw`SELECT 1`;
    return { ready: true };
  }
}