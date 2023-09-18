import { BadRequestException, Injectable } from '@nestjs/common';
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
}
