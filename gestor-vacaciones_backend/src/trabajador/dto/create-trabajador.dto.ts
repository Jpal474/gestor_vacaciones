/* eslint-disable prettier/prettier */
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Departamento } from 'src/departamento/departamento.entity';
import { EmpleadoGenero } from 'src/empleado/empleado-models/empleado-genero.enum';
import { Usuario } from 'src/usuario/usuario.entity';

export class CreateTrabajadorDto {
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

  @IsNotEmpty()
  usuario: Usuario;

  @IsNotEmpty()
  departamento: Departamento;
}
