/* eslint-disable prettier/prettier */

import { ApiProperty } from "@nestjs/swagger"
import { Usuario } from "src/usuario/usuario.entity"
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Solicitud {
    @PrimaryGeneratedColumn({type: "int"})
    @ApiProperty()
    id?: number

    @Column()
    @ApiProperty()
    fecha_inicio: string

    @Column()
    @ApiProperty()
    fecha_fin: string

    @Column()
    @ApiProperty()
    estado: string

    @Column()
    @ApiProperty()
    fecha_creacion: string

    @ManyToOne(() => Usuario, (usuario) => usuario.solicitud)
    @JoinColumn()
    @ApiProperty({type: () => Usuario})
    usuario: Usuario 

}