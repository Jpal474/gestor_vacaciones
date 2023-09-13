/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthCredentialDto {
  @IsNotEmpty()
  @IsString()
  nombre_usuario: string;

  @IsNotEmpty()
  @IsString()
  contraseña: string;
}
