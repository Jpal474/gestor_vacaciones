import { Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { EmpleadoService } from './empleado.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Empleado } from './empleado.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('empleado')
@ApiTags('Empleados')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class EmpleadoController {
  constructor(private empleadoService: EmpleadoService) {}

  @Get('vacaciones')
  @ApiOperation({
    summary: 'Obtener el porcentaje total de empleados de vacaciones',
  })
  @ApiResponse({
    status: 200,
    description: 'Regresa true si el porcentaje es mayor a 30%',
    isArray: false,
    type: Boolean,
  })
  getPorcentajeEmpleados(): Promise<boolean> {
    return this.empleadoService.porcentajeEmpleados();
  }

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

  @Get('/:size/:number')
  getAllEmpleados(
    @Param('size') size: number,
    @Param('number') number: number,
  ): Promise<{ empleados: Empleado[]; pages: number }> {
    return this.empleadoService.getEmpleados(size, number);
  }

  @Put('/:id/:opcion')
  @ApiOperation({
    summary:
      'Actualiza el estado del empleado a DE VACACIONES al aceptar la solicitud de sus vacaciones',
  })
  @ApiResponse({
    status: 200,
    description: 'Regresa true si ha actualizado el estado de forma éxitosa',
    isArray: false,
    type: Boolean,
  })
  updateEmpleadoStatus(
    @Param('id') id: string,
    @Param('opcion') opcion: number,
  ): Promise<boolean> {
    return this.empleadoService.updateEmpleadoStatus(id, opcion);
  }
}
