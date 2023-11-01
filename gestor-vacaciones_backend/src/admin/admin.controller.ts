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
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  
  @ApiOperation({summary:'Obetener todos los administradores'})
  @ApiResponse({
    status:200,
    description:'Se han obtenido a todos los usuarios del tipo Administrador',
    isArray:true,
     type: Empleado,
  })
  @Get()
  getAdministradores(): Promise<Empleado[]> {
    return this.adminService.getAdministradores('Administrador');
  }

@ApiOperation({summary: 'Crear un Administrador'})
@ApiBody({
  description: 'Datos del Administrador a ser registrado',
  type: CreateAdminDto
})
@ApiResponse({
  status:200,
  description:'Se ha creado éxitosamente al Administrador',
  isArray: false,
  type: Empleado,
})
  @Post()
  crearAdministrador(
    @Body() createAdminDto: CreateAdminDto,
  ): Promise<Empleado> {
    console.log(createAdminDto);
    return this.adminService.createAdministrador(createAdminDto);
  }

  @ApiOperation({summary: 'Enviar Mail Observaciones'})
  @ApiBody({
    description: 'Destinatario y mensaje a enviar',
    type: EnviarMailDto
  })
  @ApiResponse({
    status:200,
    description: 'El mail ha sido enviado correctamente al destinatario',
    type: Boolean,
    isArray:false,
  })
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
      return true;
    } catch (error) {
      console.log(error);
      
      return 'Error al enviar el correo';
    }
  }

  @ApiOperation({summary: 'Mail de aviso de creación de solicitud vacacional'})
  @ApiBody({
    description: 'Mensaje y correos de Administradores y SuperAdministradores',
    type: EmailSolicitudEmpleado,
    isArray: false,
  })
  @ApiResponse({
    status:200,
    description: 'El mail ha sido enviado correctamente a todos los Administradores y SuperAdministradores',
    type: Boolean,
    isArray: false,
  })
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

  @ApiOperation({summary: 'Obtener el Administrador por ID'})
  @ApiParam({name: 'ID', description: 'ID del Administrador a buscar'})
  @ApiResponse({
    status: 200,
    description: 'Se ha obtenido al Administrador y su información en base a su ID',
    type: Empleado,
    isArray: false,
  })
  @Get('/:id')
  getAdministradorById(@Param('id') id: string): Promise<Empleado> {
    return this.adminService.getAdministradorById(id);
  }

  @ApiOperation({summary: 'Envio de Mail de Solicitud Rechazada al trabajador que la creó'})
  @ApiParam({
    name: 'Destinatario', 
    description:'Dirección de correo del trabajador que creó la solicitud'
  })
  @ApiResponse({
    status:200,
    description: 'Se ha enviado correctamente el mail de rechazo al trabajador',
    type: Boolean,
    isArray: false,
  })
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

  @ApiOperation({summary: 'Enviar Mail de Solicitud Aprobada al trabajador que creó la solicitud'})
  @ApiParam({
  name: 'Destinatario', 
  description:'Diirección de correo del trabajador que creó la solicitud'
})
@ApiResponse({
  status:200,
  description: 'El mail se ha enviado de forma correcta al trabajador',
  type: Boolean,
  isArray:false,
})
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

  @ApiOperation({summary: 'Actualizar Administrador'})
  @ApiBody({
    description:'Datos actualizados del Administrador',
    type:UpdateAdministradorDto,

  })
  @ApiParam({name: 'ID', description: 'ID del Administrador a ser actualizado'})
  @ApiResponse({
    status:200,
    description: 'El Administrador ha sido actualizado de forma correcta',
    type:UpdateAdministradorDto,
    isArray:false,
  })
  @Put('/:id')
  updateAdministrador(
    @Param('id') id: string,
    @Body() updateAdministradorDto: UpdateAdministradorDto,
  ): Promise<Empleado> {
    return this.adminService.updateAdministrador(id, updateAdministradorDto);
  }

  @ApiOperation({summary: 'Borrado de Administrador en base a su ID'})
  @ApiParam({name: 'ID', description:'ID del Administrador a ser borrado'})
  @ApiResponse({
    status:200,
    description: 'El Administrador ha sido borrado de forma éxitosa',
    type: Boolean,
  })
  @Delete('/:id')
  eliminarAdministradores(@Param('id') id: string): Promise<boolean> {
    return this.adminService.deleteAdministrador(id);
  }
}
