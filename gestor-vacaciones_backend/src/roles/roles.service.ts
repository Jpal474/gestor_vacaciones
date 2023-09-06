import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from './roles.entity';
import { Repository } from 'typeorm';
import { CreateRolDto } from './dto/create-rol..dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles)
    private rolesRepository: Repository<Roles>,
  ) {}

  async createRol(createRolDto: CreateRolDto): Promise<Roles> {
    try {
      const rol = this.rolesRepository.create(createRolDto);
      await this.rolesRepository.save(rol);
      return rol;
    } catch (error) {
      if (error.code === '23502') {
        throw new BadRequestException('Error: Datos Invalidos Para El Rol');
      }
    }
  }
}
