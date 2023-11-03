import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class MailDto{

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    asunto: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    destinatario: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    mensaje: string;
}