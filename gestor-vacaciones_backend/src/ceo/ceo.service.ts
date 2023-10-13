import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ceo } from './ceo.entity';
import { Repository } from 'typeorm';
import { UpdateCeoDto } from './dto/update-ceo.dto';

@Injectable()
export class CeoService {
  constructor(
    @InjectRepository(Ceo)
    private ceoRepository: Repository<Ceo>,
  ) {}

  async getCeoByUserId(id: string): Promise<Ceo> {
    try {
      const ceo = await this.ceoRepository.find({
        relations: ['usuario'],
        where: { usuario: { id: id } },
      });

      if (!ceo) {
        throw new NotFoundException(`No se ha encontrado al CEO`);
      }
      return ceo[0];
    } catch (error) {
      throw new Error(error);
    }
  }

  async getCeoById(id: string): Promise<Ceo> {
    try {
      const ceo = await this.ceoRepository.find({
        relations: ['usuario'],
        where: { id: id },
      });
      if (!ceo) {
        throw new NotFoundException(`No se ha encontrado al CEO`);
      }
      return ceo[0];
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateCeo(id: string, updateCeoDto: UpdateCeoDto) {
    try {
      const ceo = await this.ceoRepository.findOneBy({ id: id });
      ceo.nombre = updateCeoDto.nombre;
      ceo.apellidos = updateCeoDto.apellidos;
      ceo.genero = updateCeoDto.genero;
      const ceo_actualizado = await this.ceoRepository.save(ceo);
      return ceo_actualizado;
    } catch (error) {}
  }
}
