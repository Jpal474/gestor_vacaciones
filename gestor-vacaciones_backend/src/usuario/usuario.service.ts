import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
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

  async findCorreosByRolId(opcion: number): Promise<string[]> {
    let correos;
    if (opcion === 1) {
      correos = await this.usuarioRepository
        .createQueryBuilder('usuario')
        .select('usuario.correo', 'correo')
        .where('usuario.rolId = :rolId1 OR usuario.rolId = :rolId2', {
          rolId1: 1,
          rolId2: 2,
        })
        .getRawMany();
    } else {
      correos = await this.usuarioRepository
        .createQueryBuilder('usuario')
        .select('usuario.correo', 'correo')
        .where('usuario.rolId = :rolId1', {
          rolId1: 1,
        })
        .getRawMany();
    }

    return correos.map((item) => item.correo);
  }

  async createEncargado(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const mail = await this.usuarioRepository.findOneBy({
      correo: createUsuarioDto.correo,
    });

    const nom_usuario = await this.usuarioRepository.findOneBy({
      nombre_usuario: createUsuarioDto.nombre_usuario,
    });
    if (mail) {
      throw new HttpException(
        'El correo ya se encuentra en uso',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (nom_usuario) {
      throw new HttpException(
        'El nombre de usuario ya se encuentra en uso',
        HttpStatus.BAD_REQUEST,
      );
    }
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
        throw new BadRequestException('Datos Invalidos Para El Encargado');
      } else {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
    }
  }

  async updateUsuario(
    updateUsuarioDto: UpdateUsuarioDto,
    id: string,
  ): Promise<Usuario> {
    try {
      console.log('contraseña', updateUsuarioDto.contraseña);
      const mail = await this.usuarioRepository.findOneBy({
        correo: updateUsuarioDto.correo,
      });
      const nom_usuario = await this.usuarioRepository.findOneBy({
        nombre_usuario: updateUsuarioDto.nombre_usuario,
      });
      const usuario = await this.getUsuarioById(id);
      if (mail && mail.id !== usuario.id) {
        throw new HttpException(
          'El correo ya se encuentra en uso',
          HttpStatus.BAD_REQUEST,
        );
      }
      if (nom_usuario && nom_usuario.id !== usuario.id) {
        throw new HttpException(
          'El nombre de usuario ya se encuentra en uso',
          HttpStatus.BAD_REQUEST,
        );
      }
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
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async deleteUsuario(id: string): Promise<boolean> {
    const result = await this.usuarioRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(
        `No se ha encontrado usuario para el ID ${id}`,
      );
    }
    return true;
  }
}
