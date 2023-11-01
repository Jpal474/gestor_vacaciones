/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Departamento } from 'src/departamento/departamento.entity';
import { EmpleadoGenero } from 'src/empleado/empleado-models/empleado-genero.enum';
export class UpdateAdministradorDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  apellidos: string;

  @IsEnum(EmpleadoGenero)
  @IsNotEmpty()
  @ApiProperty()
  genero: EmpleadoGenero;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  fecha_contratacion: string;

  @IsNotEmpty()
  departamento: Departamento;

}
