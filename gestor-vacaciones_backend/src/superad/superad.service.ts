import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Empleado } from 'src/empleado/empleado.entity';

import { Repository } from 'typeorm';
import { CreateSuperDto } from './dto/create-superad.dto';
import { Ceo } from 'src/ceo/ceo.entity';

@Injectable()
export class SuperadService {
  constructor(
    @InjectRepository(Ceo)
    private ceoRepository: Repository<Ceo>,
  ) {}

  async createSuper(createSuperAdminDto: CreateSuperDto): Promise<Ceo> {
    try {
      const superad = this.ceoRepository.create(createSuperAdminDto);
      this.ceoRepository.save(superad);
      return superad;
    } catch (error) {
      throw new Error(error);
    }
  }
}
