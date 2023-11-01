import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Empleado } from 'src/empleado/empleado.entity';
import { Usuario } from 'src/usuario/usuario.entity';
import { Repository } from 'typeorm';
import { CreateTrabajadorDto } from './dto/create-trabajador.dto';
import { UpdateTrabajadorDto } from './dto/update-trabajador.dto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class TrabajadorService {
  constructor(
    @InjectRepository(Empleado)
    private empleadoRepository: Repository<Empleado>,
  ) {}

  async getTrabajadores(
    nombre: string,
    pageSize: number,
    pageNumber: number,
    anio: number,
  ): Promise<{ trabajadores: Empleado[]; pages: number }> {
    try {
      const all_trabajadores = await this.empleadoRepository
        .createQueryBuilder('empleado')
        .leftJoinAndSelect('empleado.usuario', 'usuario')
        .leftJoinAndSelect('usuario.rol', 'rol')
        .leftJoinAndSelect('empleado.departamento', 'departamento') // Add this line
        .leftJoinAndSelect('empleado.saldo_vacacional', 'saldo_vacacional') //
        .where('rol.nombre = :nombre', { nombre })
        .andWhere('saldo_vacacional.año = :anio', { anio })
        .getMany();

      const pages = Math.ceil(all_trabajadores.length / pageSize);
      const trabajadores = all_trabajadores.slice(
        (pageNumber - 1) * pageSize,
        pageNumber * pageSize,
      );
      return { trabajadores, pages };
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
      const trabajador_creado = await this.empleadoRepository.save(trabajador);
      console.log(trabajador_creado);
      return trabajador_creado;
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
      trabajador.departamento = updateTrabajadorDto.departamento;
      this.empleadoRepository.save(trabajador);
      return trabajador;
    } catch (error) {
      console.log('error en actualizar trabajador');
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
