import { Controller, Get } from '@nestjs/common';

// No controller path prefix → routes are exactly /healthz and /readyz
@Controller()
export class HealthController {
  @Get('healthz')
  liveness() {
    return { ok: true };
  }

  @Get('readyz')
  readiness() {
    return { ready: true };
  }
}