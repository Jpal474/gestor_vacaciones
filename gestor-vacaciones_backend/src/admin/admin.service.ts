import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/usuario/usuario.entity';
import { Repository } from 'typeorm';
import { UpdateAdministradorDto } from './dto/update-admin.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Usuario)
    private userRepository: Repository<Usuario>,
  ) {}
  async getAdministradores(id: number): Promise<Usuario[]> {
    try {
      const administradores = this.userRepository.find({
        relations: ['rol'],
        where: {
          rol: { id: id },
        },
      });
      if (!administradores) {
        throw new NotFoundException(
          `Departamentos para el Supermercado "${id}" no han sido encontrados`,
        );
      }
      return administradores;
    } catch (error) {
      console.log(error);
    }
  }

  async getAdministradorById(id: string): Promise<Usuario> {
    try {
      const administrador = await this.userRepository.findOneBy({ id: id });
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

  async updateAdministrador(
    id: string,
    updateAdministradorDto: UpdateAdministradorDto,
  ): Promise<Usuario> {
    let admin = await this.getAdministradorById(id);
    if (updateAdministradorDto.contraseña) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(
        updateAdministradorDto.contraseña,
        salt,
      );
      updateAdministradorDto.contraseña = hashedPassword;
      const { confirmar_contraseña, ...nuevoDto } = updateAdministradorDto;
      admin = nuevoDto;
    } else {
      updateAdministradorDto.contraseña = admin.contraseña;
      admin = updateAdministradorDto;
    }
    await this.userRepository.save(admin);
    return admin;
  }

  async deleteAdministrador(id: string): Promise<boolean> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `Administrador con el id: "${id}" no ha sido encontrado`,
      );
    } else {
      return true;
    }
  }
}
