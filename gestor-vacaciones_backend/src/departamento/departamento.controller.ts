import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { DepartamentoService } from './departamento.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateDepartamentoDto } from './dto/create-departamento.dto';
import { Departamento } from './departamento.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('departamento')
@ApiTags('Departamentos')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class DepartamentoController {
  constructor(private departamentosService: DepartamentoService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los departamentos sin paginacion' })
  @ApiResponse({
    status: 200,
    description: 'Regresa un objeto cpn los datos del Departamento Encontrado',
    isArray: true,
    type: Departamento,
  })
  getAllDepartamentos(): Promise<Departamento[]> {
    return this.departamentosService.getAllDepartamentos();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Obtener Departamento a partir de su ID' })
  @ApiParam({ name: 'ID', description: 'ID del Departamento a buscar' })
  @ApiResponse({
    status: 200,
    description: 'Regresa un objeto con los datos del Departamento encontrado',
    isArray: false,
    type: Departamento,
  })
  getDepartamentoById(@Param('id') id: number): Promise<Departamento> {
    return this.departamentosService.getDepartamentoById(id);
  }

  @Get('/:size/:number')
  @ApiOperation({ summary: 'Obtener todos los departamentos' })
  @ApiParam({
    name: 'Size',
    description: 'Numero de elementos a mostrar en el front',
  })
  @ApiParam({
    name: 'Number',
    description: 'Numero de página a obtener para mostrar en front',
  })
  @ApiResponse({
    status: 200,
    description: 'Regresa un arreglo con los datos de los departamentos',
    isArray: true,
    type: Departamento,
  })
  getDepartamentos(
    @Param('size') size: number,
    @Param('number') number: number,
  ): Promise<{ departamentos: Departamento[]; pages: number }> {
    return this.departamentosService.getDepartamentos(size, number);
  }

  @Post()
  @ApiOperation({ summary: 'Crear Departamento' })
  @ApiBody({
    description: 'Datos del Departamento',
    type: CreateDepartamentoDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Regresa una objeto con los datos del departamento creado',
    isArray: false,
    type: Departamento,
  })
  createDepartamento(@Body() createDepartamentoDto): Promise<Departamento> {
    return this.departamentosService.createDepartamento(createDepartamentoDto);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Elimina un Departamento por su ID' })
  @ApiParam({ name: 'ID', description: 'ID del Departamento' })
  @ApiResponse({
    status: 200,
    description: 'Regresa true si el departamento ha sido eliminado',
    isArray: false,
    type: Boolean,
  })
  deleteDepartamentoById(@Param('id') id: number): Promise<boolean> {
    return this.departamentosService.deleteDepartamento(id);
  }
}
