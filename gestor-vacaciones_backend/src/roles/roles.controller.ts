import { Body, Controller, Post } from '@nestjs/common';
import { Roles } from './roles.entity';
import { RolesService } from './roles.service';
import { CreateRolDto } from './dto/create-rol..dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('roles')
@ApiTags('Roles')
export class RolesController {
  constructor(private rolService: RolesService) {}
  @Post()
  @ApiOperation({summary: 'Creación de Rol'})
  @ApiBody({
    description: 'Datos del Rol a crear',
    type: CreateRolDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Se ha creado el Rol de forma éxitosa',
  })
  createRol(@Body() createRolDto: CreateRolDto): Promise<Roles> {
    return this.rolService.createRol(createRolDto);
  }
}
