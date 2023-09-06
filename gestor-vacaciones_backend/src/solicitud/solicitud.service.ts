import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Solicitud } from './solicitud.entity';
import { Repository } from 'typeorm';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';

@Injectable()
export class SolicitudService {
  constructor(
    @InjectRepository(Solicitud)
    private solicitudRepository: Repository<Solicitud>,
  ) {}

  async createSolicitud(
    createSolicitudDto: CreateSolicitudDto,
  ): Promise<Solicitud> {
    try {
      console.log('entra a service');

      const fecha = new Date(Date.now()); //obtenemos el día actual a partir del cual creamos un nuevo obejeto de tipo date
      const fecha_solicitud = fecha.toLocaleDateString();
      console.log('----- fecha contratacion');
      //formateamos la fecha de la forma dd/mm/yyyy
      createSolicitudDto.fecha_creacion = fecha_solicitud;
      console.log('dto', createSolicitudDto);
      const solicitud = await this.solicitudRepository.create(
        createSolicitudDto,
      );
      console.log('error en create');
      await this.solicitudRepository.save(solicitud);
      console.log('error en save');
      return solicitud;
    } catch (error) {
      console.log(error);
    }
  }
}
