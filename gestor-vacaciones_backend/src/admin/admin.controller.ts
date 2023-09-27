/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { Usuario } from 'src/usuario/usuario.entity';
import { UpdateAdministradorDto } from './dto/update-admin.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Empleado } from 'src/empleado/empleado.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { EnviarMailDto } from './dto/enviar-mail.dto';
import { EmailService } from 'src/email/email.service';
import { EmailSolicitudEmpleado } from 'src/trabajador/dto/solicitud-email-usuario.dto';

@Controller('admin')
@ApiTags('Admins')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class AdminController {
  constructor(
    private adminService: AdminService,
    private mailService: EmailService,
  ) {}
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

  @Post('email')
 async enviarMail(@Body() mail: EnviarMailDto) {
    try {
      const htmlContent = `
      <h1>Observaciones sobre su solicitud</h1>
      <p>${mail.mensaje}</p>
    `;
      await this.mailService.sendMail(
        mail.destinatario,
        'Observaciones Solicitud',
        htmlContent,
      );
      return 'Correo enviado exitosamente';
    } catch (error) {
      console.log(error);
      
      return 'Error al enviar el correo';
    }
  }
  @Post('email/solicitud')
  async enviarMailSolicitud(@Body() mail: EmailSolicitudEmpleado) {
    try {
      const htmlContent = `
      <h1>Solicitud Vacacional</h1>
      <p>${mail.nombre} ha creado una solicitud, revise la página y apruebela o rechacela antes de que esta expire</p>
    `;
      await this.mailService.sendMailTrabajador(
        mail.destinatarios,
        'Nueva Solicitud',
        htmlContent,
      );
      return true;
    } catch (error) {
      console.log(error);

      return 'Error al enviar el correo';
    }
  }


  @Get('/:id')
  getAdministradorById(@Param('id') id: string): Promise<Empleado> {
    return this.adminService.getAdministradorById(id);
  }
  @Post('email/rechazar/:destinatario')
  async enviarMailRechazada(@Param('destinatario') destinatario: string) {
    try {
      const htmlContent = `
      <h1>Solicitud Rehazada</h1>
      <p>Su solicitud vacacional ha sido rechazada</p>
    `;
      await this.mailService.sendMail(
        destinatario,
        'Estado Solicitud',
        htmlContent,
      );
      return true;
    } catch (error) {
      console.log(error);

      return 'Error al enviar el correo';
    }
  }

  @Post('email/aprobar/:destinatario')
  async enviarMailAprobada(@Param('destinatario') destinatario: string) {
    try {
      const htmlContent = `
      <h1>Solicitud Aprobada</h1>
      <p>Su solicitud vacacional ha sido aprobada.</p>
      <p>Disfrute sus Vacaciones!</p>
    `;
      await this.mailService.sendMail(
        destinatario,
        'Estado Solicitud',
        htmlContent,
      );
      return true;
    } catch (error) {
      console.log(error);

      return 'Error al enviar el correo';
    }
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
