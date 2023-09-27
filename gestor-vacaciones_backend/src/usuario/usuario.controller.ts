import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { Usuario } from './usuario.entity';
import { UsuarioService } from './usuario.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private usuarioService: UsuarioService) {}

  @Get('correos/:opcion')
  getMailByRol(@Param('opcion') opcion: number): Promise<string[]> {
    return this.usuarioService.findCorreosByRolId(opcion);
  }

  @Post()
  crearUsuario(@Body() createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    return this.usuarioService.createEncargado(createUsuarioDto);
  }

  @Put('/:id')
  updateUsuario(
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @Param('id') id: string,
  ): Promise<Usuario> {
    return this.usuarioService.updateUsuario(updateUsuarioDto, id);
  }

  @Delete('/:id')
  deleteUsuario(@Param('id') id: string): Promise<boolean> {
    return this.usuarioService.deleteUsuario(id);
  }
}
