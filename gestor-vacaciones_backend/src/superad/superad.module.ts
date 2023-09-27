import { Module } from '@nestjs/common';
import { SuperadController } from './superad.controller';
import { SuperadService } from './superad.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empleado } from 'src/empleado/empleado.entity';
import { Ceo } from 'src/ceo/ceo.entity';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ceo])],
  controllers: [SuperadController],
  providers: [SuperadService, EmailService],
})
export class SuperadModule {}
