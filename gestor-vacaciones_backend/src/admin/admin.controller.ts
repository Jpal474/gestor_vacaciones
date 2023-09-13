import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Usuario } from 'src/usuario/usuario.entity';
import { UpdateAdministradorDto } from './dto/update-admin.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Empleado } from 'src/empleado/empleado.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('admin')
@ApiTags('Admins')
export class AdminController {
  constructor(private adminService: AdminService) {}
  @Get()
  getAdministradores(): Promise<Empleado[]> {
    return this.adminService.getAdministradores('Administrador');
  }

  @Post()
  crearAdministrador(
    @Body() createAdminDto: CreateAdminDto,
  ): Promise<Empleado> {
    console.log(createAdminDto);
    return this.adminService.createAdministrador(createAdminDto);
  }

  @Get('/:id')
  getAdministradorById(@Param('id') id: string): Promise<Empleado> {
    return this.adminService.getAdministradorById(id);
  }

  @Put('/:id')
  updateAdministrador(
    @Param('id') id: string,
    @Body() updateAdministradorDto: UpdateAdministradorDto,
  ): Promise<Empleado> {
    return this.adminService.updateAdministrador(id, updateAdministradorDto);
  }

  @Delete('/:id')
  eliminarAdministradores(@Param('id') id: string): Promise<boolean> {
    return this.adminService.deleteAdministrador(id);
  }
}
