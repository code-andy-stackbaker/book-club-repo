// Authors feature module — just wires controller + service.
// Keep modules boring; all interesting logic goes in services.
import { Module } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { AuthorsController } from './authors.controller';

@Module({
  providers: [AuthorsService],
  controllers: [AuthorsController],
})
export class AuthorsModule {}