/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';

export class AprobarSolicitudDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;
}
