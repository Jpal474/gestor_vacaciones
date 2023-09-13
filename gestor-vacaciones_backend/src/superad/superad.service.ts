import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Empleado } from 'src/empleado/empleado.entity';

import { Repository } from 'typeorm';
import { CreateSuperDto } from './dto/create-superad.dto';

@Injectable()
export class SuperadService {
  constructor(
    @InjectRepository(Empleado)
    private empleadoRepository: Repository<Empleado>,
  ) {}

  async createSuper(createSuperAdminDto: CreateSuperDto): Promise<Empleado> {
    try {
      const superad = this.empleadoRepository.create(createSuperAdminDto);
      this.empleadoRepository.save(superad);
      return superad;
    } catch (error) {
      throw new Error(error);
    }
  }
}
