/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEmpresaDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  direccion: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  telefono: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  correo: string;
}
