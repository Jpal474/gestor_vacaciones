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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Usuario } from 'src/usuario/usuario.entity';
import { TrabajadorService } from './trabajador.service';
import { Empleado } from 'src/empleado/empleado.entity';
import { CreateTrabajadorDto } from './dto/create-trabajador.dto';
import { UpdateDateColumn } from 'typeorm';
import { UpdateTrabajadorDto } from './dto/update-trabajador.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('trabajador')
@ApiTags('Trabajadores')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class TrabajadorController {
  constructor(private trabajadorService: TrabajadorService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener lista de Trabajadores' })
  @ApiResponse({
    status: 200,
    description: 'Regresa un Array de Trabajadores',
    isArray: true,
    type: Empleado,
  })
  getTrabajadores(): Promise<Empleado[]> {
    return this.trabajadorService.getTrabajadores('Trabajador');
  }

  @Post()
  @ApiOperation({ summary: 'Crea un Trabajador' })
  @ApiBody({
    description: 'Datos del Trabajador a Registrar',
    type: Empleado,
  })
  @ApiResponse({
    status: 200,
    description: 'Regresa un objeto con los datos del Trabajador',
    isArray: true,
    type: Empleado,
  })
  createTrabajador(
    @Body() createTrabajadorDto: CreateTrabajadorDto,
  ): Promise<Empleado> {
    return this.trabajadorService.createTrabajador(createTrabajadorDto);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Actualiza los datos del trabajador' })
  @ApiResponse({
    status: 200,
    description: 'Regresa un objeto con los datos del Trabajador Actualizado',
    isArray: false,
    type: Empleado,
  })
  @ApiParam({ name: 'ID', description: 'ID del Trabajador' })
  @ApiBody({
    description: 'Datos Actualizados del Trabajador',
    type: UpdateDateColumn,
  })
  updateTrabajadorDto(
    @Param('id') id: string,
    @Body()
    updateTrabajadorDto: UpdateTrabajadorDto,
  ): Promise<Empleado> {
    return this.trabajadorService.updateTrabajador(id, updateTrabajadorDto);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Borra al Trabajador acorde a su ID' })
  @ApiResponse({
    status: 200,
    description: 'Regresa true en caso de que el borrado haya sido éxitoso',
    isArray: false,
    type: Boolean,
  })
  @ApiParam({ name: 'ID', description: 'ID del Trabajador' })
  deleteTrabajador(@Param('id') id: string): Promise<boolean> {
    return this.trabajadorService.deleteTrabajador(id);
  }
}