/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Empleado } from 'src/empleado/empleado.entity';

export class CreateSaldoVacacionalDto {
  @IsNotEmpty()
  @IsNumber()
  año: number;

  @IsNotEmpty()
  @IsNumber()
  dias_disponibles: number;

  @IsNotEmpty()
  @IsNumber()
  dias_tomados: number;

  @IsNotEmpty()
  empleado: Empleado;
}
