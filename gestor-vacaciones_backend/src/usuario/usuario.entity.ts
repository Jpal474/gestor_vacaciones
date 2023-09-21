/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsuarioGenero } from './usuario-models/usuario-genero-enum';
import { Roles } from 'src/roles/roles.entity';
import { Solicitud } from 'src/solicitud/solicitud.entity';
import { SaldoVacacional } from 'src/saldo-vacacional/saldo-vacacional.entity';
import { Empleado } from 'src/empleado/empleado.entity';
import { Ceo } from 'src/ceo/ceo.entity';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id?: string;

  @Column()
  @ApiProperty()
  nombre_usuario: string;

  @Column()
  @ApiProperty()
  correo: string;

  @Column()
  @ApiProperty()
  contraseña: string;

  @ManyToOne(() => Roles, (rol) => rol.usuario)
  @ApiProperty({type: () => Roles})
  rol: Roles;

  @OneToOne(() => Empleado, (empleado) => empleado.usuario)
  @ApiProperty({ type: () => Empleado, isArray: false })
  empleado: Empleado;

  @OneToOne(() => Ceo, (ceo) => ceo.usuario)
  @ApiProperty({type: () => Ceo})
  @Exclude({toPlainOnly:true})
  ceo: Ceo;

}