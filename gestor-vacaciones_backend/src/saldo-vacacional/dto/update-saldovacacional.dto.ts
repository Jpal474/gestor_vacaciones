/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateSaldoVacacionalDto {
  @IsNotEmpty()
  @IsNumber()
  dias_disponibles: number;

  @IsNotEmpty()
  @IsNumber()
  dias_tomados: number;
}
