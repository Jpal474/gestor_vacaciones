/* eslint-disable prettier/prettier */

import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Roles } from 'src/roles/roles.entity';
import { Solicitud } from 'src/solicitud/solicitud.entity';
import { UsuarioGenero } from 'src/usuario/usuario-models/usuario-genero-enum';

export class UpdateAdministradorDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  apellidos: string;

  @IsNotEmpty()
  @IsEnum({ UsuarioGenero })
  genero: UsuarioGenero;

  @IsNotEmpty()
  @IsString()
  fecha_contratacion: string;

  @IsOptional()
  @IsString()
  contraseña: string;

  @IsOptional()
  @IsString()
  confirmar_contraseña: string;

  @IsNotEmpty()
  rol:Roles

  @IsOptional()
  solicitud: Solicitud[];

}
