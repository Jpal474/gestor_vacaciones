/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { Empresa } from './empresa.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('empresa')
@ApiTags('empresa')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class EmpresaController {
  constructor(private empresaService: EmpresaService) {}

  @Get()
  @ApiOperation({ summary: 'Traer Datos Empresa' })
  @ApiResponse({
    status: 200,
    description: 'Regresa un objeto con los datos de la empresa obtenida',
    isArray: false,
    type: Empresa,
  })
  getEmpresa(): Promise<Empresa> {
    return this.empresaService.getEmpresa(1);
  }

  @Post()
  @ApiOperation({ summary: 'Crear Empresa' })
  @ApiBody({
    description: 'Datos de la empresa para ser registrada',
    type: CreateEmpresaDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Regresa un objeto con los datos de la empresa creada',
    isArray: false,
    type: Empresa,
  })
  createEmpresa(@Body() createEmpresaDto: CreateEmpresaDto): Promise<Empresa> {
    return this.empresaService.createEmpresa(createEmpresaDto);
  }
}
