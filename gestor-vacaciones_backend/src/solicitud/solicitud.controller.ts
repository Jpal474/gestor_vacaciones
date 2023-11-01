import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Solicitud } from './solicitud.entity';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { SolicitudService } from './solicitud.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateSolicitudDto } from './dto/update-solicitud.dto';
import { AprobarSolicitudDto } from './dto/aprobar-solicitud.dto';
import { DenegarSolicitudDto } from './dto/denegar-solicitud.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('solicitud')
@ApiTags('Solicitud')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class SolicitudController {
  constructor(private solicitudService: SolicitudService) {}

  @Get('contar_solicitudes')
  @ApiOperation({ summary: 'Contar Solicitudes Pendientes' })
  @ApiResponse({
    status: 200,
    description: 'Regresa el Número de Solicitudes Pendientes',
    isArray: false,
    type: Number,
  })
  contarSolicitudes(): Promise<number> {
    return this.solicitudService.countPendingSolicitudes();
  }

  @Get('pendientes_trab')
  @ApiOperation({
    summary: 'Contar Solicitudes Pendientes de los Trabajadores',
  })
  @ApiResponse({
    status: 200,
    description:
      'Regresa el Número de Solicitudes Pendientes de los Trabajadores',
    isArray: false,
    type: Number,
  })
  contarSolicitudesTrabajadores(): Promise<number> {
    return this.solicitudService.getSolicitudesPendientesTrabajadores();
  }

  @Get('aprobadas')
  @ApiOperation({ summary: 'Obtiene todas las solicitudes Aprobadas' })
  @ApiResponse({
    status: 200,
    description: 'Regresa una lista con las solicitudes aprobadas',
    isArray: true,
    type: Solicitud,
  })
  getSolicitudesAprobadas(): Promise<Solicitud[]> {
    return this.solicitudService.getSolicitudesAprobadas();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Obtener Solicitud a partir de su ID' })
  @ApiParam({ name: 'id', description: 'ID de la Solicitud' })
  @ApiResponse({
    status: 200,
    description:
      'Regresa una lista de trabajadores pertenecientes a un Departamento',
    isArray: false,
    type: Solicitud,
  })
  gettrabajadoresByDepartamento(@Param('id') id: number): Promise<Solicitud> {
    return this.solicitudService.getSolicitudById(id);
  }

  @Get('aprobadas/:id')
  @ApiOperation({
    summary: 'Obtiene todas las solicitudes Aprobadas de Un Usuario Especifico',
  })
  @ApiParam({
    name: 'ID',
    description: 'ID del Usuario a buscar sus solicitudes ',
  })
  @ApiResponse({
    status: 200,
    description: 'Regresa una lista con las solicitudes aprobadas',
    isArray: true,
    type: Solicitud,
  })
  getSolicitudesAprobadasByEmpleado(
    @Param('id') id: string,
  ): Promise<Solicitud[]> {
    return this.solicitudService.getSolicitudesAprobadasByEmpleado(id);
  }

  @Get('/:size/:number/:op')
  @ApiOperation({ summary: 'Listar Solicitudes' })
  @ApiParam({
    name: 'Size',
    description: 'Tamaño de registros a mostrar en front',
  })
  @ApiParam({
    name: 'Number',
    description: 'Número de página a mostrar en front',
  })
  @ApiParam({
    name: 'Op',
    description: 'Opción para forma de orndenar los datos',
  })
  getSolicitudes(
    @Param('size') size: number,
    @Param('number') number: number,
    @Param('op') op: number,
  ): Promise<{ solicitudes: Solicitud[]; pages: number }> {
    return this.solicitudService.getAllSolicitudes(size, number, op);
  }

  @Get('empleados/:id/:size/:number/:op')
  @ApiOperation({
    summary: 'Obtener todas las solicitudes de un empleado en específico',
  })
  @ApiParam({ name: 'id', description: 'ID del Empleado' })
  @ApiParam({
    name: 'Size',
    description: 'Tamaño de registros a mostrar en front',
  })
  @ApiParam({
    name: 'Number',
    description: 'Número de página a mostrar en front',
  })
  @ApiParam({
    name: 'Op',
    description: 'Opción para forma de orndenar los datos',
  })
  @ApiResponse({
    status: 200,
    description:
      'Regresa un array con las solicitudes pertenecientes al usuario del cual se ha mandado el ID',
    isArray: true,
    type: Solicitud,
  })
  getSolicitudesEmpleados(
    @Param('id') id: string,
    @Param('size') size: number,
    @Param('number') number: number,
    @Param('op') op: number,
  ): Promise<{ solicitudes: Solicitud[]; pages: number }> {
    return this.solicitudService.getSolicitudesByEmpleado(id, size, number, op);
  }

  @Get('trabajadores/:size/:number/:op')
  @ApiOperation({ summary: 'Listar Solicitudes' })
  @ApiParam({
    name: 'Size',
    description: 'Tamaño de registros a mostrar en front',
  })
  @ApiParam({
    name: 'Number',
    description: 'Número de página a mostrar en front',
  })
  @ApiParam({
    name: 'Op',
    description: 'Opción para forma de orndenar los datos',
  })
  getSolicitudesTrabajadores(
    @Param('size') size: number,
    @Param('number') number: number,
    @Param('op') op: number,
  ): Promise<{ solicitudes: Solicitud[]; pages: number }> {
    return this.solicitudService.getSolicitudesTrabajadores(size, number, op);
  }

  @Post()
  @ApiOperation({ summary: 'Crear Solicitud' })
  @ApiBody({
    description: 'Datos de la Solicitud',
    type: CreateSolicitudDto,
  })
  createSolicitud(
    @Body() createSolicitudDto: CreateSolicitudDto,
  ): Promise<Solicitud> {
    return this.solicitudService.createSolicitud(createSolicitudDto);
  }

  @Put('/aprobar/:id')
  @ApiOperation({ summary: 'Aprobar Solicitud' })
  @ApiParam({ name: 'ID', description: 'ID de la Solicitud aprobada' })
  @ApiBody({
    description: 'Nombre de usuario de la persona quién aprobó la solicitud',
    type: String,
  })
  @ApiParam({
    name: 'ID',
    description: 'ID de la Solicitud a Aprobar',
  })
  @ApiResponse({
    status: 200,
    description: 'Regresa True Si la Solicitud Ha Sido Aprobada',
    isArray: false,
    type: Boolean,
  })
  aprobarSolicitud(
    @Param('id') id: number,
    @Body() aprobarSolicitudDto: AprobarSolicitudDto,
  ): Promise<boolean> {
    return this.solicitudService.aceptarSolicitud(id, aprobarSolicitudDto);
  }

  @Put('/denegar/:id')
  @ApiOperation({ summary: 'Denegar Solicitud' })
  @ApiParam({ name: 'ID', description: 'ID de la solicitud a rechazar' })
  @ApiBody({
    description: 'Nombre de usuario de la persona quién rechazó la solicitud',
    type: String,
  })
  @ApiParam({
    name: 'ID',
    description: 'ID de la Solicitud a Rechazar',
  })
  @ApiResponse({
    status: 200,
    description:
      'Regresa True Si la Solicitud Ha Sido Rechazada de Forma Éxitosa',
    isArray: false,
    type: Boolean,
  })
  denegarSolicitud(
    @Param('id') id: number,
    @Body() denegarSolicitudDto: DenegarSolicitudDto,
  ): Promise<boolean> {
    return this.solicitudService.denegarSolicitud(id, denegarSolicitudDto);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Editar Solicitud' })
  @ApiParam({
    name: 'ID',
    description: 'ID de la Solicitud a Editar',
  })
  @ApiBody({
    description: 'Datos Actualizados de la Solicitud',
    type: UpdateSolicitudDto,
  })
  updateSolicitudDto(
    @Param('id') id: number,
    @Body() updateSolicitudDto: UpdateSolicitudDto,
  ) {
    return this.solicitudService.updateSolicitud(id, updateSolicitudDto);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Eliminar Solicitud' })
  @ApiParam({ name: 'ID', description: 'ID de la Solicitud a Eliminar' })
  @ApiResponse({
    status: 200,
    description: 'Borrado Exitoso de la solicitud',
    isArray: false,
    type: Boolean,
  })
  deleteSolicitud(@Param('id') id: number): Promise<boolean> {
    return this.solicitudService.deleteSolicitud(id);
  }
}
