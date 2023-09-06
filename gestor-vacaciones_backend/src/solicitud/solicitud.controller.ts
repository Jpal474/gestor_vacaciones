import { Body, Controller, Post } from '@nestjs/common';
import { Solicitud } from './solicitud.entity';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { SolicitudService } from './solicitud.service';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

@Controller('solicitud')
export class SolicitudController {
  constructor(private solicitudService: SolicitudService) {}
  @Post()
  @ApiOperation({ summary: 'Crear Solicitud' })
  @ApiBody({
    description: 'Datos de la Solicitud',
    type: CreateSolicitudDto,
  })
  createSolicitud(
    @Body() createSolicitudDto: CreateSolicitudDto,
  ): Promise<Solicitud> {
    return this.solicitudService.createSolicitud(createSolicitudDto);
  }
}
