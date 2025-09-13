/// <reference types="jest" />

import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { HealthModule } from '../src/health/health.module';

describe('Health endpoints', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const modRef = await Test.createTestingModule({
      imports: [HealthModule],
    }).compile();

    app = modRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/healthz -> { ok: true }', async () => {
    await request(app.getHttpServer())
      .get('/api/healthz')
      .expect(200)
      .expect({ ok: true });
  });

  it('GET /api/readyz -> { ready: true }', async () => {
    await request(app.getHttpServer())
      .get('/api/readyz')
      .expect(200)
      .expect({ ready: true });
  });
});