import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Empleado } from './empleado.entity';
import { Not, Repository } from 'typeorm';

@Injectable()
export class EmpleadoService {
  constructor(
    @InjectRepository(Empleado)
    private empleadoRepository: Repository<Empleado>,
  ) {}

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
        relations: ['usuario'],
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
}
