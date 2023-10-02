/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { SaldoVacacional } from 'src/saldo-vacacional/saldo-vacacional.entity';
import { Solicitud } from 'src/solicitud/solicitud.entity';
import { Usuario } from 'src/usuario/usuario.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EmpleadoGenero } from './empleado-models/empleado-genero.enum';
import { Departamento } from 'src/departamento/departamento.entity';
import { Exclude } from 'class-transformer';
import { EstadoEmpleado } from './empleado-models/empleado-estado.enum';

@Entity()
export class Empleado {
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
  genero: EmpleadoGenero;

  @Column()
  @ApiProperty()
  fecha_contratacion?: string;

  @OneToOne(() => Usuario, (usuario) => usuario.empleado)
  @JoinColumn()
  @ApiProperty({ type: () => Usuario, isArray: false })
  usuario: Usuario;
 
  @ManyToOne(() => Departamento, (departamento) => departamento.empleado)
  @ApiProperty({ type: () => Departamento, isArray:false})
  departamento?: Departamento;

  @Column({default: EstadoEmpleado.ACTIVO})
  @ApiProperty()
  estado: EstadoEmpleado;

  @OneToMany(() => Solicitud, (solicitud) => solicitud.empleado, {
    nullable: true,
  })
  @ApiProperty({ type: () => Solicitud, isArray: true })
  solicitud?: Solicitud[];

  @OneToMany(
    () => SaldoVacacional,
    (saldo_vacacional) => saldo_vacacional.empleado,
    { nullable: true },
  )
  @ApiProperty({ type: () => SaldoVacacional, isArray: true })
  saldo_vacacional?: SaldoVacacional[];
}
