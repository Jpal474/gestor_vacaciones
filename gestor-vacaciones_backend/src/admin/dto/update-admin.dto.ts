/* eslint-disable prettier/prettier */

import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EmpleadoGenero } from 'src/empleado/empleado-models/empleado-genero.enum';
import { Roles } from 'src/roles/roles.entity';
import { Solicitud } from 'src/solicitud/solicitud.entity';
import { UsuarioGenero } from 'src/usuario/usuario-models/usuario-genero-enum';

export class UpdateAdministradorDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @IsEnum(EmpleadoGenero)
  @IsNotEmpty()
  genero: EmpleadoGenero;

  @IsString()
  @IsNotEmpty()
  fecha_contratacion: string;

}
