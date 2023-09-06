import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Usuario } from 'src/usuario/usuario.entity';
import { UpdateAdministradorDto } from './dto/update-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}
  @Get()
  getAdministradores(): Promise<Usuario[]> {
    return this.adminService.getAdministradores(2);
  }

  @Get('/:id')
  getAdministradorById(@Param('id') id: string): Promise<Usuario> {
    return this.adminService.getAdministradorById(id);
  }

  @Put('/:id')
  updateAdministrador(
    @Param('id') id: string,
    @Body() updateAdministradorDto: UpdateAdministradorDto,
  ): Promise<Usuario> {
    return this.adminService.updateAdministrador(id, updateAdministradorDto);
  }

  @Delete('/:id')
  eliminarAdministradores(@Param('id') id: string): Promise<boolean> {
    return this.adminService.deleteAdministrador(id);
  }
}
