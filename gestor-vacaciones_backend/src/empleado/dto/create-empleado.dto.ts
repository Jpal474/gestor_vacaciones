/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';
import { EmpleadoGenero } from '../empleado-models/empleado-genero.enum';
import { Usuario } from 'src/usuario/usuario.entity';
import { Departamento } from 'src/departamento/departamento.entity';

export class CreateEmpleadoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  apellidos: string;

  @IsNotEmpty()
  @IsString()
  genero: EmpleadoGenero;

  @IsNotEmpty()
  usuario: Usuario;

  @IsNotEmpty()
  departamento: Departamento;
}
