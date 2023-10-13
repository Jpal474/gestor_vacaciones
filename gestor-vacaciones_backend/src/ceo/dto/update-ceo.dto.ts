import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CeoGenero } from '../ceo-models/ceo-genero.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCeoDto {
  @IsString()
  @ApiProperty()
  nombre: string;

  @IsString()
  @IsOptional()
  @ApiProperty()
  apellidos: string;

  @IsEnum(CeoGenero)
  @IsOptional()
  @ApiProperty()
  genero: CeoGenero;
}
