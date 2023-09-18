import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SaldoVacacionalService } from './saldo-vacacional.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SaldoVacacional } from './saldo-vacacional.entity';
import { CreateSaldoVacacionalDto } from './dto/create-saldovacacional.dto';
import { UpdateSaldoVacacionalDto } from './dto/update-saldovacacional.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('saldo-vacacional')
@ApiTags('Saldo Vacacional')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class SaldoVacacionalController {
  constructor(private saldoService: SaldoVacacionalService) {}

  @Get(':id/:anio')
  @ApiOperation({ summary: 'Obtener Saldo Vacacionales del Empleado' })
  @ApiResponse({
    status: 200,
    description:
      'Regresa el saldo vacacional correspondiente al ID de un empleado y el año',
    isArray: false,
    type: SaldoVacacional,
  })
  getSaldoByUser(
    @Param('id') id: string,
    @Param('anio') anio: number,
  ): Promise<SaldoVacacional> {
    return this.saldoService.getSaldoByEmpleado(id, anio);
  }

  @Post()
  @ApiOperation({ summary: 'Crear Saldo Vacacional' })
  @ApiBody({
    description: 'Datos del Saldo Vacacional del Empleado',
    type: SaldoVacacional,
  })
  @ApiResponse({
    status: 200,
    description:
      'Regresa un objeto con los datos del Saldo Vacacional del Empleo',
    isArray: false,
    type: SaldoVacacional,
  })
  createSaldoVacacional(
    @Body() createSaldoVacacionalDto: CreateSaldoVacacionalDto,
  ) {
    return this.saldoService.createSaldoVacacional(createSaldoVacacionalDto);
  }

  @Put('/:id')
  @ApiOperation({
    summary: 'Actualiza los Datos del Saldo Vacacional',
  })
  @ApiResponse({
    status: 200,
    description: 'Acutaliza los datos del Saldo Vacacional',
    isArray: false,
    type: SaldoVacacional,
  })
  @ApiBody({
    description: 'Datos Para el Saldo a ser Actualizados',
    type: SaldoVacacional,
  })
  updateSaldoDto(
    @Param('/:id') id: number,
    @Body() updateSaldoDto: UpdateSaldoVacacionalDto,
  ): Promise<SaldoVacacional> {
    return this.saldoService.updateSaldoVacacional(id, updateSaldoDto);
  }
}
