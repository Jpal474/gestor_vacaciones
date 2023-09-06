/* eslint-disable prettier/prettier */

import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Empresa {
  @PrimaryGeneratedColumn({ type: 'int' })
  @ApiProperty()
  id?: number;

  @Column()
  @ApiProperty()
  nombre: string;

  @Column({type: 'text'})
  @ApiProperty()
  direccion: string;

  @Column()
  @ApiProperty()
  telefono: string;

  @Column()
  @ApiProperty()
  correo: string;

}
