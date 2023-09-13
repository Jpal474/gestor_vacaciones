import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { DepartamentoService } from './departamento.service';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateDepartamentoDto } from './dto/create-departamento.dto';
import { Departamento } from './departamento.entity';

@Controller('departamento')
export class DepartamentoController {
  constructor(private departamentosService: DepartamentoService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los departamentos' })
  @ApiResponse({
    status: 200,
    description: 'Regresa un arreglo con los datos de los departamentos',
    isArray: true,
    type: Departamento,
  })
  getDepartamentos(): Promise<Departamento[]> {
    return this.departamentosService.getDepartamentos();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Obtener Departamento a partir de su ID' })
  @ApiResponse({
    status: 200,
    description: 'Regresa un objeto con los datos del Departamento encontrado',
    isArray: false,
    type: Departamento,
  })
  getDepartamentoById(@Param('id') id: number): Promise<Departamento> {
    return this.departamentosService.getDepartamentoById(id);
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
