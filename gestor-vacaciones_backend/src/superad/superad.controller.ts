import { Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Empleado } from 'src/empleado/empleado.entity';
import { SuperadService } from './superad.service';
import { CreateSuperDto } from './dto/create-superad.dto';
import { Ceo } from 'src/ceo/ceo.entity';

@Controller('superad')
export class SuperadController {
  constructor(private superAdminService: SuperadService) {}

  @Post()
  @ApiOperation({ summary: 'Crear SuperAdmin' })
  @ApiBody({ description: 'Datos del SuperAdministradir para ser registrado' })
  @ApiResponse({
    status: 200,
    description:
      'Regresa un objeto con los datos del SuperAdministrador creado',
    isArray: false,
    type: Empleado,
  })
  createSuperAdmin(createSuperAdmin: CreateSuperDto): Promise<Ceo> {
    console.log('nombre', createSuperAdmin);
    return this.superAdminService.createSuper(createSuperAdmin);
  }
}
