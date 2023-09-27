import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Empleado } from 'src/empleado/empleado.entity';
import { SuperadService } from './superad.service';
import { CreateSuperDto } from './dto/create-superad.dto';
import { Ceo } from 'src/ceo/ceo.entity';
import { EnviarMailDto } from './dto/enviar-mail.dto';
import { EmailService } from 'src/email/email.service';
@Controller('superad')
export class SuperadController {
  constructor(
    private superAdminService: SuperadService,
    private mailService: EmailService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear SuperAdmin' })
  @ApiBody({ description: 'Datos del SuperAdministradir para ser registrado' })
  @ApiResponse({
    status: 200,
    description:
      'Regresa un objeto con los datos del SuperAdministrador creado',
    isArray: false,
    type: Empleado,
  })
  createSuperAdmin(@Body() createSuperAdmin: CreateSuperDto): Promise<Ceo> {
    console.log('nombre', createSuperAdmin);
    return this.superAdminService.createSuper(createSuperAdmin);
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
      return 'Correo enviado exitosamente';
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
      return 'Correo enviado exitosamente';
    } catch (error) {
      console.log(error);

      return 'Error al enviar el correo';
    }
  }
}
