import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { Ceo } from './ceo.entity';
import { CeoService } from './ceo.service';
import { UpdateCeoDto } from './dto/update-ceo.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('ceo')
export class CeoController {
  constructor(private ceoService: CeoService) {}

  @Get('/:id')
  @ApiOperation({ summary: 'Obtener al CEO por su ID' })
  @ApiParam({ name: 'ID', description: 'ID del CEO a buscar' })
  @ApiResponse({
    status: 200,
    description: 'Se ha encontrado al CEO para el ID',
    type: Ceo,
    isArray: false,
  })
  getCeoById(@Param('id') id: string): Promise<Ceo> {
    return this.ceoService.getCeoById(id);
  }

  @Get('usuario/:id')
  @ApiOperation({ description: 'Obtener CEO a partir de su ID como Usuario' })
  @ApiParam({ name: 'ID', description: 'ID de Usuario del CEO a buscar' })
  @ApiResponse({
    status: 200,
    description: 'Se ha encontrado éxitosamente al CEO',
    type: Ceo,
    isArray: false,
  })
  getCeoByUserId(@Param('id') id: string): Promise<Ceo> {
    return this.ceoService.getCeoByUserId(id);
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Actualizar datos del CEO' })
  @ApiParam({ name: 'ID', description: 'ID del CEO a Actualizar' })
  @ApiBody({ description: 'Datos del CEO actualizados', type: UpdateCeoDto })
  @ApiResponse({
    status: 200,
    description: 'El CEO ha sido actualizado de forma correcta',
    type: Ceo,
    isArray: false,
  })
  updateCeo(
    @Param('id') id: string,
    @Body() updateCeoDto: UpdateCeoDto,
  ): Promise<Ceo> {
    return this.ceoService.updateCeo(id, updateCeoDto);
  }
}
