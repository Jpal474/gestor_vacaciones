/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Empleado } from 'src/empleado/empleado.entity';

export class CreateSaldoVacacionalDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  año: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  dias_disponibles: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  dias_tomados: number;

  @IsNotEmpty()
  @ApiProperty()
  empleado: Empleado;
}
