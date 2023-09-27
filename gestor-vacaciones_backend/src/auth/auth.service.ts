/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/usuario/usuario.entity';
import { Repository } from 'typeorm';
import { AuthCredentialDto } from './dto/auth-credentials-dto';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from './jwt.payload.interface';
import { Empleado } from 'src/empleado/empleado.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private jwtService: JwtService,
  ) {}

  async signIn(
    authCredentialsDto: AuthCredentialDto,
  ): Promise<{ accessToken: string }> {
    const { correo, contraseña } = authCredentialsDto;
    const user = await this.usuarioRepository.findOne({
      relations: ['rol'],
      where: { correo: correo },
    });
    const id = user.id;
    const rol = user.rol.nombre;
    const nombre = user.nombre_usuario;
    if (user && (await bcrypt.compare(contraseña, user.contraseña))) {
      console.log('entra access token');
      
      const payload: JwtPayload = { id, correo, rol, nombre };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException(
        'Correo o contraseña no válidos, revise sus credenciales',
      );
    }
  }
}
