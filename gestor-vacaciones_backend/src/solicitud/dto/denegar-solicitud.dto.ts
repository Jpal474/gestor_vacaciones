/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';

export class DenegarSolicitudDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;
}
