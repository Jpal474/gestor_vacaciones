import { Module } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { Empleado } from './empleado.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Empleado])],
  providers: [EmpleadoService],
})
export class EmpleadoModule {}
