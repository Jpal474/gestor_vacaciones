import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Solicitud } from './solicitud.entity';
import { Repository } from 'typeorm';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { UpdateSolicitudDto } from './dto/update-solicitud.dto';
import { AprobarSolicitudDto } from './dto/aprobar-solicitud.dto';
import { DenegarSolicitudDto } from './dto/denegar-solicitud.dto';

@Injectable()
export class SolicitudService {
  constructor(
    @InjectRepository(Solicitud)
    private solicitudRepository: Repository<Solicitud>,
  ) {}

  async getSolicitudById(id: number): Promise<Solicitud> {
    try {
      const found = await this.solicitudRepository.find({
        relations: ['empleado', 'empleado.usuario'],
        where: { id: id },
      });
      if (!found) {
        throw new NotFoundException(`Solicitud No Econtrada Para el ID: ${id}`);
      }
      return found[0];
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAllSolicitudes(
    pageSize: number,
    pageNumber: number,
    opcion: number,
  ): Promise<{ solicitudes: Solicitud[]; pages: number }> {
    try {
      let all_solicitudes;
      if (Number(opcion) === 1) {
        all_solicitudes = await this.solicitudRepository
          .createQueryBuilder('solicitud')
          .innerJoinAndSelect('solicitud.empleado', 'empleado')
          .innerJoin('empleado.usuario', 'usuario')
          .addOrderBy('solicitud.estado', 'ASC')
          .getMany();
      } else if (Number(opcion) === 2) {
        all_solicitudes = await this.solicitudRepository
          .createQueryBuilder('solicitud')
          .innerJoinAndSelect('solicitud.empleado', 'empleado')
          .innerJoin('empleado.usuario', 'usuario')
          .addOrderBy('solicitud.fecha_inicio', 'DESC')
          .getMany();
      } else if (Number(opcion) === 3) {
        all_solicitudes = await this.solicitudRepository
          .createQueryBuilder('solicitud')
          .innerJoinAndSelect('solicitud.empleado', 'empleado')
          .innerJoin('empleado.usuario', 'usuario')
          .addOrderBy('solicitud.empleado', 'ASC')
          .getMany();
      }

      if (!all_solicitudes) {
        throw new NotFoundException(`No Se Han Encontrado Solicitudes`);
      }
      const pages = Math.ceil(all_solicitudes.length / pageSize);
      const solicitudes = all_solicitudes.slice(
        (pageNumber - 1) * pageSize,
        pageNumber * pageSize,
      );
      return { solicitudes, pages };
    } catch (error) {
      console.log(error);
    }
  }

  async getSolicitudesTrabajadores(
    pageSize: number,
    pageNumber: number,
    opcion: number,
  ): Promise<{ solicitudes: Solicitud[]; pages: number }> {
    try {
      let all_solicitudes;
      if (Number(opcion) === 1) {
        all_solicitudes = await this.solicitudRepository
          .createQueryBuilder('solicitud')
          .innerJoinAndSelect('solicitud.empleado', 'empleado')
          .innerJoin('empleado.usuario', 'usuario')
          .innerJoin('usuario.rol', 'rol', 'rol.nombre = :rolName', {
            rolName: 'Trabajador',
          })
          .addOrderBy('solicitud.estado', 'ASC')
          .getMany();
      } else if (Number(opcion) === 2) {
        all_solicitudes = await this.solicitudRepository
          .createQueryBuilder('solicitud')
          .innerJoinAndSelect('solicitud.empleado', 'empleado')
          .innerJoin('empleado.usuario', 'usuario')
          .innerJoin('usuario.rol', 'rol', 'rol.nombre = :rolName', {
            rolName: 'Trabajador',
          })
          .addOrderBy('solicitud.fecha_inicio', 'DESC')
          .getMany();
      } else if (Number(opcion) === 3) {
        all_solicitudes = await this.solicitudRepository
          .createQueryBuilder('solicitud')
          .innerJoinAndSelect('solicitud.empleado', 'empleado')
          .innerJoin('empleado.usuario', 'usuario')
          .innerJoin('usuario.rol', 'rol', 'rol.nombre = :rolName', {
            rolName: 'Trabajador',
          })
          .addOrderBy('solicitud.empleado', 'ASC')
          .getMany();
      }

      if (!all_solicitudes) {
        throw new NotFoundException(
          'No Se Han Encontrado Solicitudes Para Trabajadores',
        );
      }
      const pages = Math.ceil(all_solicitudes.length / pageSize);
      const solicitudes = all_solicitudes.slice(
        (pageNumber - 1) * pageSize,
        pageNumber * pageSize,
      );
      return { solicitudes, pages };
    } catch (error) {
      console.log(error);
    }
  }

  async createSolicitud(
    createSolicitudDto: CreateSolicitudDto,
  ): Promise<Solicitud> {
    try {
      console.log('entra a service');

      const fecha = new Date(Date.now()); //obtenemos el día actual a partir del cual creamos un nuevo obejeto de tipo date
      const fecha_solicitud = fecha.toLocaleDateString();
      //formateamos la fecha de la forma dd/mm/yyyy
      createSolicitudDto.fecha_creacion = fecha_solicitud;
      console.log('dto', createSolicitudDto);
      const solicitud = await this.solicitudRepository.create(
        createSolicitudDto,
      );
      const solicitud_creada = await this.solicitudRepository.save(solicitud);
      return solicitud_creada;
    } catch (error) {
      console.log(error);
    }
  }

  async updateSolicitud(
    id: number,
    updateSolicitudDto: UpdateSolicitudDto,
  ): Promise<Solicitud> {
    try {
      const solicitud = await this.getSolicitudById(id); //obtengo los datos de mi solicitud a través de su id
      //actulizo los datos necesarios, al ser el id auto incrementable, se creará una nueva solicitud en caso de que no se guarde e mi variabe anterior
      solicitud.fecha_inicio = updateSolicitudDto.fecha_inicio; //actualizo la fecha de inicio
      solicitud.fecha_fin = updateSolicitudDto.fecha_fin; //actualizo la fecha de fin
      solicitud.justificacion = updateSolicitudDto.justificacion; //actualizo la justificacion con la que tiene el DTO
      await this.solicitudRepository.save(solicitud);
      return solicitud;
    } catch (error) {
      if (error.code === '23502') {
        throw new BadRequestException(
          'Error: Datos Invalidos Para La Solicitud',
        );
      }
    }
  }

  async countPendingSolicitudes(): Promise<number> {
    try {
      const number = await this.solicitudRepository.count({
        where: {
          estado: 'PENDIENTE',
        },
      });
      return number;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getSolicitudesPendientesTrabajadores(): Promise<number> {
    const total = await this.solicitudRepository
      .createQueryBuilder('solicitud')
      .innerJoin('solicitud.empleado', 'empleado')
      .innerJoin('empleado.usuario', 'usuario')
      .innerJoin('usuario.rol', 'rol', 'rol.nombre = :rolName', {
        rolName: 'Trabajador',
      })
      .where('solicitud.estado = :estado', { estado: 'PENDIENTE' })
      .getCount();
    return total;
  }

  async getSolicitudesAprobadas(): Promise<Solicitud[]> {
    try {
      const found = await this.solicitudRepository.find({
        relations: ['empleado'],
        where: { estado: 'ACEPTADO' },
      });
      return found;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getSolicitudesAprobadasByEmpleado(id: string): Promise<Solicitud[]> {
    try {
      const found = await this.solicitudRepository.find({
        relations: ['empleado'],
        where: { estado: 'ACEPTADO', empleado: { id: id } },
      });
      return found;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getSolicitudesByEmpleado(
    id: string,
    pageSize: number,
    pageNumber: number,
    opcion: number,
  ): Promise<{ solicitudes: Solicitud[]; pages: number }> {
    try {
      let found;
      if (Number(opcion) === 1) {
        found = await this.solicitudRepository.find({
          relations: ['empleado'],
          where: {
            empleado: { id: id },
          },
          order: {
            estado: 'ASC',
          },
        });
      } else if (Number(opcion) === 2) {
        found = await this.solicitudRepository.find({
          relations: ['empleado'],
          where: {
            empleado: { id: id },
          },
          order: {
            fecha_inicio: 'DESC',
          },
        });
      }
      if (!found) {
        throw new NotFoundException(
          `No se han encontrado solicitudes para este empleado`,
        );
      }
      const pages = Math.ceil(found.length / pageSize);
      const solicitudes = found.slice(
        (pageNumber - 1) * pageSize,
        pageNumber * pageSize,
      );
      return { solicitudes, pages };
    } catch (error) {
      throw new Error(error);
    }
  }

  async aceptarSolicitud(
    id: number,
    aprobarSolicitudDto: AprobarSolicitudDto,
  ): Promise<boolean> {
    try {
      console.log(aprobarSolicitudDto.nombre);
      const solicitud = await this.getSolicitudById(id);
      solicitud.estado = 'ACEPTADO';
      solicitud.aprobada_por = aprobarSolicitudDto.nombre;
      this.solicitudRepository.save(solicitud);
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  async denegarSolicitud(
    id: number,
    denegarSolicitudDto: DenegarSolicitudDto,
  ): Promise<boolean> {
    try {
      const solicitud = await this.getSolicitudById(id);
      solicitud.estado = 'RECHAZADO';
      solicitud.aprobada_por = '';
      solicitud.denegada_por = denegarSolicitudDto.nombre;
      this.solicitudRepository.save(solicitud);
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteSolicitud(id: number): Promise<boolean> {
    try {
      const result = await this.solicitudRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(
          `Solicitud para el ID ${id} no ha sido encontrado`,
        );
      }
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }
}
