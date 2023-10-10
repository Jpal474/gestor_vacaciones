/* eslint-disable prettier/prettier */
import {ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EstadoSolicitud } from '../solicitud-models/solicitud-estado-enum';
import { Usuario } from 'src/usuario/usuario.entity';
import { Empleado } from 'src/empleado/empleado.entity';

export class CreateSolicitudDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  fecha_inicio: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  fecha_fin: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(EstadoSolicitud)
  @ApiProperty()
  estado: EstadoSolicitud;

  @IsOptional()
  @ApiProperty()
  fecha_creacion: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  justificacion: string;

  @IsNotEmpty()
  empleado:Empleado;
}
