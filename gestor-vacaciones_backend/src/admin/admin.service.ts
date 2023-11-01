import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateAdministradorDto } from './dto/update-admin.dto';
import * as bcrypt from 'bcryptjs';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Empleado } from 'src/empleado/empleado.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Empleado) //inyecto el repositorio para poder hacer uso de este
    private empleadoRepository: Repository<Empleado>,
  ) {}
  async getAdministradores(nombre: string): Promise<Empleado[]> {
    try {
      return await this.empleadoRepository
        .createQueryBuilder('empleado')
        .leftJoinAndSelect('empleado.usuario', 'usuario')
        .leftJoinAndSelect('usuario.rol', 'rol')
        .leftJoinAndSelect('empleado.departamento', 'departamento') // Add this line
        .where('rol.nombre = :nombre', { nombre })
        .getMany();
    } catch (error) {
      console.log(error);
    }
  }

  async getAdministradorById(id: string): Promise<Empleado> {
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

  async createAdministrador(createAdminDto: CreateAdminDto): Promise<Empleado> {
    try {
      const admin = this.empleadoRepository.create(createAdminDto);
      const admin_creado = this.empleadoRepository.save(admin);
      return admin_creado;
    } catch (error) {
      console.log(error);
    }
  }

  async updateAdministrador(
    id: string,
    updateAdministradorDto: UpdateAdministradorDto,
  ): Promise<Empleado> {
    try {
      const admin = await this.getAdministradorById(id);
      admin.nombre = updateAdministradorDto.nombre;
      admin.apellidos = updateAdministradorDto.apellidos;
      admin.genero = updateAdministradorDto.genero;
      admin.fecha_contratacion = updateAdministradorDto.fecha_contratacion;
      admin.departamento = updateAdministradorDto.departamento;
      await this.empleadoRepository.save(admin);
      return admin;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteAdministrador(id: string): Promise<boolean> {
    const result = await this.empleadoRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Administrador con el id: "${id}" no ha sido encontrado`,
      );
    } else {
      return true;
    }
  }
}
