/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UsuarioGenero } from './usuario-models/usuario-genero-enum';
import { Roles } from 'src/roles/roles.entity';
import { Solicitud } from 'src/solicitud/solicitud.entity';
import { SaldoVacacional } from 'src/saldo-vacacional/saldo-vacacional.entity';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id?: string;

  @Column()
  @ApiProperty()
  nombre: string;

  @Column()
  @ApiProperty()
  apellidos: string;

  @Column()
  @ApiProperty()
  genero: UsuarioGenero;
  
  @Column()
  @ApiProperty()
  fecha_contratacion: string;

  @Column()
  @ApiProperty()
  contraseña: string;

  @ManyToOne(() => Roles, (rol) => rol.usuario)
  @Exclude({toPlainOnly:true})
  @ApiProperty({type: () => Roles})
  rol: Roles;

  @OneToMany(() => Solicitud, (solicitud) => solicitud.usuario, {nullable:true})
  @JoinColumn()
  @ApiProperty({type: () => Solicitud, isArray:true})
  solicitud?:Solicitud[];

  @OneToMany(() => SaldoVacacional, (saldo_vacacional) => saldo_vacacional.usuario, {nullable:true})
  @ApiProperty({type: () => SaldoVacacional, isArray:true})
  saldo_vacacional?:SaldoVacacional[]
}