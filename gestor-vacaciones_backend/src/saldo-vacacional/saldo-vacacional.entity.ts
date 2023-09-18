/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { Empleado } from 'src/empleado/empleado.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @ManyToOne(() => Empleado, (empleado) => empleado.saldo_vacacional)
  @JoinColumn()
  @ApiProperty({type: () => Empleado})
  empleado:Empleado;
}
