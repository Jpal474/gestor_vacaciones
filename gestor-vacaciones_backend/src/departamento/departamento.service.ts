/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  HttpException,
  HttpStatus,
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

  async getAllDepartamentos(): Promise<Departamento[]> {
    try {
      const query = await this.departamentoRepository.createQueryBuilder(
        'departamentos',
      );
      const all_departamentos = await query.getMany();
      if (!all_departamentos) {
        throw new NotFoundException('No se han encontrado departamentos');
      }
      return all_departamentos;
    } catch (error) {
      throw new Error(error);
    }
  }
  
  async getDepartamentos(pageSize: number, pageNumber: number): Promise<{departamentos: Departamento[], pages:number}> {
    try {
      const query = await this.departamentoRepository.createQueryBuilder(
        'departamentos',
      );
      const all_departamentos = await query.getMany();
      if (!all_departamentos) {
        throw new NotFoundException('No se han encontrado departamentos');
      }
      const pages = Math.ceil(all_departamentos.length / pageSize);
      const departamentos = all_departamentos.slice(
        (pageNumber - 1) * pageSize,
        pageNumber * pageSize,
      );
      return { departamentos, pages };
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
      const departamento_repetido = await this.departamentoRepository.findOneBy({nombre: cretaeDepartamentoDto.nombre})
      if(departamento_repetido){
        throw new HttpException(
          'El departamento ya se cuentra registrado',
          HttpStatus.BAD_REQUEST,
        );
      }
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
