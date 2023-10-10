import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { Usuario } from './usuario.entity';
import { UsuarioService } from './usuario.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('usuario')
@ApiTags('Usuario')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class UsuarioController {
  constructor(private usuarioService: UsuarioService) {}

  @ApiOperation({
    description:
      'Obtiene los correos electrónicos por rol, 1 devuelve todos los del admin y superad, y 2 sólo los del superad',
  })
  @ApiResponse({
    status: 200,
    description: 'Se han obtenido todos los correos de un rol determinado',
    type: String,
    isArray: true,
  })
  @ApiParam({ name: 'Opcion', description: 'Opcion para obteener correos' })
  @Get('correos/:opcion')
  getMailByRol(@Param('opcion') opcion: number): Promise<string[]> {
    return this.usuarioService.findCorreosByRolId(opcion);
  }

  @ApiOperation({ description: 'Crea un usuario dentro de la aplicación' })
  @ApiResponse({
    status: 200,
    description: 'Se ha creado exitosamente al usuario',
    type: Usuario,
    isArray: false,
  })
  @ApiBody({
    description: 'Datos del usuario a ser creado',
    type: CreateUsuarioDto,
  })
  @Post()
  crearUsuario(@Body() createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    return this.usuarioService.createEncargado(createUsuarioDto);
  }

  @ApiOperation({ description: 'Actualiza un usuario dentro de la aplicación' })
  @ApiResponse({
    status: 200,
    description: 'Se ha actualizado exitosamente al usuario',
    type: Usuario,
    isArray: false,
  })
  @ApiBody({
    description: 'Datos del usuario a ser actualizado',
    type: UpdateUsuarioDto,
  })
  @ApiParam({ name: 'ID', description: 'ID del usuario a actualizar' })
  @Put('/:id')
  updateUsuario(
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @Param('id') id: string,
  ): Promise<Usuario> {
    return this.usuarioService.updateUsuario(updateUsuarioDto, id);
  }

  @ApiOperation({ description: 'Borrar un usuario a partir de su ID' })
  @ApiResponse({
    status: 200,
    description: 'Retorna true si ha eliminado exitosamente',
    type: Boolean,
    isArray: false,
  })
  @ApiParam({ name: 'ID', description: 'ID del usuario a ser eliminado' })
  @Delete('/:id')
  deleteUsuario(@Param('id') id: string): Promise<boolean> {
    return this.usuarioService.deleteUsuario(id);
  }
}
