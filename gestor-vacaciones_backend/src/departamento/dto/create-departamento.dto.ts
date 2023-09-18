/* eslint-disable prettier/prettier */

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { Empresa } from "src/empresa/empresa.entity";

export class CreateDepartamentoDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    nombre:string;

    @IsNotEmpty()
    @ApiProperty()
    empresa?:Empresa;
}