import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Empleado } from 'src/empleado/empleado.entity';
import { Usuario } from 'src/usuario/usuario.entity';
import { Repository } from 'typeorm';
import { CreateTrabajadorDto } from './dto/create-trabajador.dto';
import { UpdateTrabajadorDto } from './dto/update-trabajador.dto';

@Injectable()
export class TrabajadorService {
  constructor(
    @InjectRepository(Empleado)
    private empleadoRepository: Repository<Empleado>,
  ) {}

  async getTrabajadores(nombre: string): Promise<Empleado[]> {
    try {
      return await this.empleadoRepository
        .createQueryBuilder('empleado')
        .innerJoinAndSelect('empleado.usuario', 'usuario')
        .innerJoinAndSelect('usuario.rol', 'rol')
        .where('rol.nombre = :nombre', { nombre })
        .getMany();
    } catch (error) {
      console.log(error);
    }
  }

  async getTrabajadorById(id: string) {
    try {
      const administrador = await this.empleadoRepository.findOneBy({ id: id });
      if (!administrador) {
        throw new NotFoundException(
          `Encargado con el ID "${id}" no ha sido encontrado`,
        );
      }
      return administrador;
    } catch (error) {
      console.log(error);
    }
  }

  async createTrabajador(
    createTrabajadorDto: CreateTrabajadorDto,
  ): Promise<Empleado> {
    try {
      const trabajador = this.empleadoRepository.create(createTrabajadorDto);
      this.empleadoRepository.save(trabajador);
      return trabajador;
    } catch (error) {
      console.log(error);
    }
  }

  async updateTrabajador(
    id: string,
    updateTrabajadorDto: UpdateTrabajadorDto,
  ): Promise<Empleado> {
    try {
      const trabajador = await this.getTrabajadorById(id);
      trabajador.nombre = updateTrabajadorDto.nombre;
      trabajador.apellidos = updateTrabajadorDto.apellidos;
      trabajador.genero = updateTrabajadorDto.genero;
      trabajador.fecha_contratacion = updateTrabajadorDto.fecha_contratacion;
      this.empleadoRepository.save(trabajador);
      return trabajador;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteTrabajador(id: string): Promise<boolean> {
    try {
      const result = await this.empleadoRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(
          `Administrador con el id: "${id}" no ha sido encontrado`,
        );
      }
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }
}
