/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Departamento } from './departamento.entity';
import { Repository } from 'typeorm';
import { CreateDepartamentoDto } from './dto/create-departamento.dto';

@Injectable()
export class DepartamentoService {
  constructor(
    @InjectRepository(Departamento)
    private departamentoRepository: Repository<Departamento>,
  ) {}

  async getDepartamentos(): Promise<Departamento[]> {
    try {
      const query = await this.departamentoRepository.createQueryBuilder(
        'departamentos',
      );
      const departamentos = await query.getMany();
      if (!departamentos) {
        throw new NotFoundException('No se han encontrado departamentos');
      }
      return departamentos;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getDepartamentoById(id: number): Promise<Departamento> {
    try {
      const found = this.departamentoRepository.findOneBy({ id: id });
      if (!found) {
        throw new NotFoundException(
          `El Departamento con el ID ${id} no ha sido encontrado`,
        );
      }
      return found;
    } catch (error) {
      console.log(error);
    }
  }

  async createDepartamento(
    cretaeDepartamentoDto: CreateDepartamentoDto,
  ): Promise<Departamento> {
    try {
      const departamento = this.departamentoRepository.create(
        cretaeDepartamentoDto,
      );
      this.departamentoRepository.save(departamento);
      return departamento;
    } catch (error) {
      if (error.code === '23502') {
        throw new BadRequestException(
          'Error: Datos Inválidos Para El Registro del Departamento',
        );
      } else {
        console.log(error);
      }
    }
  }

  async deleteDepartamento(id: number): Promise<boolean> {
    try {
      const result = await this.departamentoRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(
          `Departamento con el id: "${id}" no ha sido encontrado`,
        );
      }
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }
}
