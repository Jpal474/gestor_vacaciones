import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import * as bcrypt from 'bcryptjs';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async getUsuarioById(id: string) {
    try {
      const found = this.usuarioRepository.findOneBy({ id: id });
      if (!found) {
        throw new NotFoundException(
          `Usuario para el ID ${id} no ha sido encontrado`,
        );
      }
      return found;
    } catch (error) {}
  }

  async createEncargado(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUsuarioDto.contraseña, salt);
    createUsuarioDto.contraseña = hashedPassword;
    const usuario = this.usuarioRepository.create(createUsuarioDto);
    try {
      await this.usuarioRepository.save(usuario);
      return usuario;
    } catch (error) {
      console.log(error);
      if (error.code === '23505') {
        throw new ConflictException(
          'El correo que ha escrito ya se encuentra en uso',
        );
      } else if (error.code === '23502') {
        throw new BadRequestException(
          'Error: Datos Invalidos Para El Encargado',
        );
      }
    }
  }

  async updateUsuario(
    updateUsuarioDto: UpdateUsuarioDto,
    id: string,
  ): Promise<Usuario> {
    try {
      const usuario = await this.getUsuarioById(id);
      if (updateUsuarioDto.contraseña) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(
          updateUsuarioDto.contraseña,
          salt,
        );
        updateUsuarioDto.contraseña = hashedPassword;
        usuario.nombre_usuario = updateUsuarioDto.nombre_usuario;
        usuario.correo = updateUsuarioDto.correo;
        usuario.contraseña = updateUsuarioDto.contraseña;
        await this.usuarioRepository.save(usuario);
      } else {
        usuario.nombre_usuario = updateUsuarioDto.nombre_usuario;
        usuario.correo = updateUsuarioDto.correo;
        await this.usuarioRepository.save(usuario);
      }
      return usuario;
    } catch (error) {
      throw new Error(error);
    }
  }
}
