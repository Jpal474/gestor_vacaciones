/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Usuario } from 'src/usuario/usuario.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SaldoVacacional {
  @PrimaryGeneratedColumn({ type: 'int' })
  @ApiProperty()
  id?: number;

  @Column()
  @ApiProperty()
  año: number;

  @Column()
  @ApiProperty()
  dias_disponibles: number;

  @Column()
  @ApiProperty()
  dias_tomados: number;

  @ManyToOne(() => Usuario, (usuario) => usuario.saldo_vacacional)
  @ApiProperty({type: () => Usuario})
  usuario:Usuario;
}
