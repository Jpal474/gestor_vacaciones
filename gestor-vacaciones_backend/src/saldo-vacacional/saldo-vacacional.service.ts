import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SaldoVacacional } from './saldo-vacacional.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSaldoVacacionalDto } from './dto/create-saldovacacional.dto';
import { UpdateSaldoVacacionalDto } from './dto/update-saldovacacional.dto';

@Injectable()
export class SaldoVacacionalService {
  constructor(
    @InjectRepository(SaldoVacacional)
    private saldoVacacionalRepository: Repository<SaldoVacacional>,
  ) {}

  async getSaldoById(id: number) {
    try {
      const found = this.saldoVacacionalRepository.findOneBy({ id: id });
      if (!found) {
        throw new NotFoundException(
          `El Departamento con el ID ${id} no ha sido encontrado`,
        );
      }
      return found;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getSaldoByEmpleado(id: string, anio: number): Promise<SaldoVacacional> {
    try {
      const found = await this.saldoVacacionalRepository.findOne({
        relations: ['empleado'],
        where: {
          año: anio,
          empleado: { id: id },
        },
      });
      if (!found) {
        throw new NotFoundException(
          `Trabajadores con el "${id}" no han sido encontrados`,
        );
      }
      return found;
    } catch (error) {}
  }

  async createSaldoVacacional(
    createSaldoVacacionalDto: CreateSaldoVacacionalDto,
  ): Promise<SaldoVacacional> {
    try {
      const saldo = await this.saldoVacacionalRepository.create(
        createSaldoVacacionalDto,
      );
      console.log(saldo);
      
      this.saldoVacacionalRepository.save(saldo);
      return saldo;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateSaldoVacacional(
    id: string,
    anio: number,
    updateSaldoVacacionalDto: UpdateSaldoVacacionalDto,
  ): Promise<SaldoVacacional> {
    try {
      const saldo = await this.getSaldoByEmpleado(id, anio);
      saldo.dias_disponibles = updateSaldoVacacionalDto.dias_disponibles;
      saldo.dias_tomados = updateSaldoVacacionalDto.dias_tomados;
      this.saldoVacacionalRepository.save(saldo);
      return saldo;
    } catch (error) {}
  }
}
