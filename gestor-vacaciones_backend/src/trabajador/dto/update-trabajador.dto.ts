/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EmpleadoGenero } from 'src/empleado/empleado-models/empleado-genero.enum';

export class UpdateTrabajadorDto {

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({nullable:false})
  apellidos: string;

  @IsEnum(EmpleadoGenero)
  @IsNotEmpty()
  genero: EmpleadoGenero;

  @IsString()
  @IsNotEmpty()
  fecha_contratacion: string;
}
