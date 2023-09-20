import { Module } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { Empleado } from './empleado.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmpleadoController } from './empleado.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Empleado])],
  providers: [EmpleadoService],
  controllers: [EmpleadoController],
})
export class EmpleadoModule {}
