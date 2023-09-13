/* eslint-disable prettier/prettier */

import { ApiProperty } from "@nestjs/swagger"
import { Empleado } from "src/empleado/empleado.entity"
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

    @Column({nullable:true, default:'', type: 'text'})
    @ApiProperty()
    justificacion: string

    @Column({nullable:true, default:''})
    @ApiProperty()
    aprobada_por: string;

    @Column({nullable:true, default:''})
    @ApiProperty()
    denegada_por: string;

    @ManyToOne(() => Empleado, (empleado) => empleado.solicitud)
    @JoinColumn()
    @ApiProperty({type: () => Empleado})
    empleado: Empleado 

}