/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Empresa } from './empresa.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateEmpresaDto } from './dto/create-empresa.dto';

@Injectable()
export class EmpresaService {
  constructor(
    @InjectRepository(Empresa)
    private empresaRepository: Repository<Empresa>,
  ) {}

  async createEmpresa(createEmpresaDto: CreateEmpresaDto): Promise<Empresa> {
    try {
      const empresa = this.empresaRepository.create(createEmpresaDto);
      await this.empresaRepository.save(empresa);
      return empresa;
    } catch (error) {
      if (error.code === '23502') {
        throw new BadRequestException(
          'Error: Datos Invalidos Para El Registro de la Empresa',
        );
      }
    }
  }

  async getEmpresa(id: number): Promise<Empresa> {
    try {
      const found = this.empresaRepository.findOneBy({ id: id });
      if (!found) {
        throw new NotFoundException(
          `Empresa Para El ID ${id} No Ha Sido Encontrada`,
        );
      }
      return found;
    } catch (error) {
      throw new Error(error);
    }
  }
}
