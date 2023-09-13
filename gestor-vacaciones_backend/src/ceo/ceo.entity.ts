/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CeoGenero } from './ceo-models/ceo-genero.enum';
import { Exclude } from 'class-transformer';
import { Usuario } from 'src/usuario/usuario.entity';

@Entity()
export class Ceo {
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
  genero: CeoGenero;

  @OneToOne(() => Usuario, (usuario) => usuario.empleado)
  @JoinColumn()
  @ApiProperty({ type: () => Usuario, isArray: false })
  usuario: Usuario;
}
