import { Controller, Get, Param } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Empleado } from './empleado.entity';

@Controller('empleado')
export class EmpleadoController {
  constructor(private empleadoService: EmpleadoService) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Obtener el Empleado por su ID' })
  @ApiResponse({
    status: 200,
    description: 'Regresa un objeto con los datos del empleado',
    isArray: false,
    type: Empleado,
  })
  getEmpleadoById(@Param('id') id: string): Promise<Empleado> {
    return this.empleadoService.getEmpleadoById(id);
  }

  @Get('usuario/:id')
  @ApiOperation({ summary: 'Obtener al empleado a partir del id del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Regresa un empleado a partir del ID el usuario relacionado',
    isArray: false,
    type: Empleado,
  })
  @ApiParam({ name: 'ID', description: 'ID del usuario' })
  getEmpleadoByUsuarioId(@Param('id') id: string): Promise<Empleado> {
    return this.empleadoService.getEmpleadoByUserId(id);
  }
}
