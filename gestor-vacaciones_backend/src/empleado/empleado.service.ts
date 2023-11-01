import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Empleado } from './empleado.entity';
import { Not, Repository } from 'typeorm';
import { EstadoEmpleado } from './empleado-models/empleado-estado.enum';
import { EstadoEmpleadoDto } from './dto/update-empleado-status.dto';

@Injectable()
export class EmpleadoService {
  constructor(
    @InjectRepository(Empleado)
    private empleadoRepository: Repository<Empleado>,
  ) {}

  async getEmpleados(pageSize, pageNumber, anio) {
    try {
      const all_empleados = await this.empleadoRepository
        .createQueryBuilder('empleado')
        .leftJoinAndSelect('empleado.usuario', 'usuario')
        .leftJoinAndSelect('usuario.rol', 'rol')
        .leftJoinAndSelect('empleado.departamento', 'departamento')
        .leftJoinAndSelect('empleado.saldo_vacacional', 'saldo_vacacional') // Add this line
        .andWhere('saldo_vacacional.año = :anio', { anio })
        .getMany();

      if (!all_empleados) {
        throw new NotFoundException('No se han encontrado empleados');
      }
      const pages = Math.ceil(all_empleados.length / pageSize);
      const empleados = all_empleados.slice(
        (pageNumber - 1) * pageSize,
        pageNumber * pageSize,
      );
      return { empleados, pages };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getEmpleadoById(id: string): Promise<Empleado> {
    try {
      const empleado = await this.empleadoRepository
        .createQueryBuilder('empleado')
        .leftJoinAndSelect('empleado.usuario', 'usuario')
        .leftJoinAndSelect('usuario.rol', 'rol') // Include the role
        .leftJoinAndSelect('empleado.departamento', 'departamento')
        .where('empleado.id = :id', { id: id }) // Filter by specific ID
        .getOne(); // Use getOne() to retrieve a single record
      if (!empleado) {
        throw new NotFoundException(
          `No se ha encontrado un empleado para el ID ${id}`,
        );
      }
      return empleado;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getEmpleadoByUserId(id: string): Promise<Empleado> {
    try {
      const found = await this.empleadoRepository.find({
        relations: ['usuario', 'departamento'],
        where: {
          usuario: { id: id },
        },
      });
      if (!found) {
        throw new NotFoundException(`No se ha encontrado al empleado`);
      }
      return found[0];
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateEmpleadoStatus(id: string, opcion: number): Promise<boolean> {
    try {
      if (opcion == 1) {
        const empleado = await this.getEmpleadoById(id);
        empleado.estado = EstadoEmpleado.DE_VACACIONES;
        this.empleadoRepository.save(empleado);
      } else if (opcion == 2) {
        const empleado = await this.getEmpleadoById(id);
        empleado.estado = EstadoEmpleado.ACTIVO;
        this.empleadoRepository.save(empleado);
      }
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }

  async porcentajeEmpleados(): Promise<boolean> {
    try {
      const query = await this.empleadoRepository.createQueryBuilder(
        'empleados',
      );
      const total_empleados = await query.getCount();
      if (!total_empleados) {
        throw new NotFoundException('No se han encontrado empleados');
      }
      const total_empleados_vacaciones = await this.empleadoRepository.count({
        where: {
          estado: EstadoEmpleado.DE_VACACIONES,
        },
      });
      if (total_empleados === 0) {
        return false;
      }
      const porcentajeEmpleados =
        (total_empleados_vacaciones / total_empleados) * 100;
      if (porcentajeEmpleados > 30) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}
