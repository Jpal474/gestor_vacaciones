import { Body, Controller, Post } from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { Empresa } from './empresa.entity';

@Controller('empresa')
export class EmpresaController {
  constructor(private empresaService: EmpresaService) {}

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
