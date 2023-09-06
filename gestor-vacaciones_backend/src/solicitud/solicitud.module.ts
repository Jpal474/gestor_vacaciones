import { Module } from '@nestjs/common';
import { SolicitudController } from './solicitud.controller';
import { SolicitudService } from './solicitud.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Solicitud } from './solicitud.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Solicitud])],
  controllers: [SolicitudController],
  providers: [SolicitudService],
})
export class SolicitudModule {}
