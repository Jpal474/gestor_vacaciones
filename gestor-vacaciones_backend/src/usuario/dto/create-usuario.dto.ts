/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Roles } from 'src/roles/roles.entity';
import { UsuarioGenero } from '../usuario-models/usuario-genero-enum';

export class CreateUsuarioDto {
    nombre:string;
    apellidos:string;
    genero: UsuarioGenero
    fecha_contratacion: string;
    contraseña: string;
}
