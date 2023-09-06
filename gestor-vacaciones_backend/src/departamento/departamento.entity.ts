/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Departamento {
  @PrimaryGeneratedColumn({ type: 'int' })
  @ApiProperty()
  id?: string;

  @Column()
  @ApiProperty()
  nombre: string;
}
