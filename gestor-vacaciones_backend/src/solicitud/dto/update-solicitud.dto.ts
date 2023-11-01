/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EstadoSolicitud } from '../solicitud-models/solicitud-estado-enum';
import { Usuario } from 'src/usuario/usuario.entity';

export class UpdateSolicitudDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  fecha_inicio: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  fecha_fin: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  justificacion: string;

}
