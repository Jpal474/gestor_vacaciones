/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Roles } from 'src/roles/roles.entity';
import { UsuarioGenero } from '../usuario-models/usuario-genero-enum';

export class UpdateUsuarioDto {

    @IsString()
    @IsNotEmpty()
    nombre_usuario:string;

    @IsString()
    @IsNotEmpty()
    correo: string;

    @IsString()
    @IsOptional()
    contraseña: string;
}
