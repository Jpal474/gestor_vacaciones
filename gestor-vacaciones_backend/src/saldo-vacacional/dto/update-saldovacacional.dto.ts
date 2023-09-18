/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateSaldoVacacionalDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  dias_disponibles: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  dias_tomados: number;
}
