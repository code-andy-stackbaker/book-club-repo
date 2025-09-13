// Thin wrapper around PrismaClient so Nest can manage its lifecycle.
// Intentional minimalism: we only add what's proven useful in real apps.
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // Bring up the DB connection when the DI container is ready.
  async onModuleInit() {
    await this.$connect();
  }

  // Play nice with SIGTERM/SIGINT; avoids hanging connections on shutdown.
  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}