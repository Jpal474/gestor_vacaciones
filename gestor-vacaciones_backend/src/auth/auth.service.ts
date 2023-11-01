/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/usuario/usuario.entity';
import { Repository } from 'typeorm';
import { AuthCredentialDto } from './dto/auth-credentials-dto';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from './jwt.payload.interface';
import { Empleado } from 'src/empleado/empleado.entity';
import { TokenDto } from './dto/token.dto';

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
    console.log('usuario mail', process.env.USER_MAIL);
    console.log('pass mail', process.env.PASS_MAIL);

    
    const { correo, contrasenia } = authCredentialsDto;
    const user = await this.usuarioRepository.findOne({
      relations: ['rol'],
      where: { correo: correo },
    });
    const id = user.id;
    const rol = user.rol.nombre;
    const nombre = user.nombre_usuario;
    if (user && (await bcrypt.compare(contrasenia, user.contraseña))) {
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

  async findUserByMail(correo: string): Promise<Usuario>{
    try {
      const usuario = await this.usuarioRepository.findOneBy({correo: correo})
      if(!usuario){
        throw new NotFoundException(`No se ha encontrado usuario con ese correo`)
      }
      return usuario;
    } catch (error) {
      throw new Error(`Hubo un error: ${error}`)
    }
  }

  async changePassword(id: string, token:TokenDto): Promise<boolean>{
  try {

    console.log(token.contraseña, 'contraseña');
    console.log(id, 'id');
    
    const usuario = await this.usuarioRepository.findOneBy({id:id})
    if(usuario){
      const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(token.contraseña, salt);
    token.contraseña = hashedPassword;
      usuario.contraseña = token.contraseña;
      await this.usuarioRepository.save(usuario);
      return true;
    }
  } catch (error) {
    throw new Error(`Hubo un error: ${error}`)
  }
  }
}
