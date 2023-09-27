import { Module } from '@nestjs/common';
import { TrabajadorController } from './trabajador.controller';
import { TrabajadorService } from './trabajador.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empleado } from 'src/empleado/empleado.entity';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([Empleado])],
  controllers: [TrabajadorController],
  providers: [TrabajadorService, EmailService],
})
export class TrabajadorModule {}
