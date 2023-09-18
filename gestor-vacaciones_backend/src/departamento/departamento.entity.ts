/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Empleado } from 'src/empleado/empleado.entity';
import { Empresa } from 'src/empresa/empresa.entity';
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Departamento {
  @PrimaryGeneratedColumn({ type: 'int' })
  @ApiProperty()
  id?: number;

  @Column()
  @ApiProperty()
  nombre: string;

  @ManyToOne(() => Empresa, (empresa) => empresa.departamento)
  @ApiProperty({ type: () => Empresa, isArray:false})
  empresa: Empresa;

  @OneToMany( () => Empleado, (empleado) => empleado.departamento)
  @ApiProperty({ type: () => Empleado, isArray:true})
  empleado: Empleado[];
}
