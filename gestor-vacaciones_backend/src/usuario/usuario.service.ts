import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

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
}
