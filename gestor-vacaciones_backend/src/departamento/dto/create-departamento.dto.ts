/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsString } from "class-validator";
import { Empresa } from "src/empresa/empresa.entity";

export class CreateDepartamentoDto {
    @IsNotEmpty()
    @IsString()
    nombre:string;

    @IsNotEmpty()
    empresa:Empresa;
}