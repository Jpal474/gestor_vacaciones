import { Body, Controller, Post } from '@nestjs/common';
import { Roles } from './roles.entity';
import { RolesService } from './roles.service';
import { CreateRolDto } from './dto/create-rol..dto';

@Controller('roles')
export class RolesController {
  constructor(private rolService: RolesService) {}
  @Post()
  createRol(@Body() createRolDto: CreateRolDto): Promise<Roles> {
    return this.rolService.createRol(createRolDto);
  }
}
