/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CeoGenero } from 'src/ceo/ceo-models/ceo-genero.enum';
import { Departamento } from 'src/departamento/departamento.entity';
import { EmpleadoGenero } from 'src/empleado/empleado-models/empleado-genero.enum';
import { Usuario } from 'src/usuario/usuario.entity';

export class CreateSuperDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  apellidos: string;

  @IsEnum(CeoGenero)
  @IsNotEmpty()
  @ApiProperty()
  genero: CeoGenero;

  @IsNotEmpty()
  @ApiProperty()
  usuario: Usuario;
}
