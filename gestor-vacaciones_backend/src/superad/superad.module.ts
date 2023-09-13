import { Module } from '@nestjs/common';
import { SuperadController } from './superad.controller';
import { SuperadService } from './superad.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empleado } from 'src/empleado/empleado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Empleado])],
  controllers: [SuperadController],
  providers: [SuperadService],
})
export class SuperadModule {}
