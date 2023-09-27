import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class EnviarMailDto {
  @IsNotEmpty()
  @ApiProperty()
  destinatario: string;

  @IsNotEmpty()
  @ApiProperty()
  mensaje: string;
}
