import { Module } from '@nestjs/common';
import { SuperadController } from './superad.controller';
import { SuperadService } from './superad.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [SuperadController],
  providers: [SuperadService],
})
export class SuperadModule {}
