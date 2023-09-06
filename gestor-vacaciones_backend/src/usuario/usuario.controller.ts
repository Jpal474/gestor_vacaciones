import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { Usuario } from './usuario.entity';
import { UsuarioService } from './usuario.service';

@Controller('usuario')
export class UsuarioController {
  constructor(private usuarioService: UsuarioService) {}
  @Post()
  crearUsuario(@Body() createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    return this.usuarioService.createEncargado(createUsuarioDto);
  }
}
