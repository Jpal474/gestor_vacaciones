import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class EmailSolicitudEmpleado {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsArray()
  destinatarios: string[];
}
