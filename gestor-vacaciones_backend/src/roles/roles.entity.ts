/* eslint-disable prettier/prettier */

import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { Usuario } from "src/usuario/usuario.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Roles {
    @PrimaryGeneratedColumn({type: "int"})
    @ApiProperty()
    id?: number

    @Column()
    @ApiProperty()
    nombre: string

    @OneToMany(() => Usuario, (usuario) => usuario.rol)
    @ApiProperty({ type: () => Usuario, isArray:true})
    usuario?:Usuario[]


}