import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Empleado } from 'src/empleado/empleado.entity';
import { SuperadService } from './superad.service';
import { CreateSuperDto } from './dto/create-superad.dto';
import { Ceo } from 'src/ceo/ceo.entity';
import { EnviarMailDto } from './dto/enviar-mail.dto';
import { EmailService } from 'src/email/email.service';
import { AuthGuard } from '@nestjs/passport';
import { MailDto } from './dto/mail.dto';
@Controller('superad')
@ApiTags('Super Admin')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
export class SuperadController {
  constructor(
    private superAdminService: SuperadService,
    private mailService: EmailService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Llamado a la funcion para actualizar saldos vacacionales',
  })
  @ApiResponse({
    status: 200,
    description: 'Actualiza los saldos vacacionales de todos los empleados',
    isArray: false,
  })
  actualizarSaldos() {
    this.superAdminService.actualizarSaldosVacacionales();
  }

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
  @ApiOperation({ summary: 'Enviar mail sobre observaciones de la solicitud' })
  @ApiBody({ description: 'Destinatario y mensaje a enviar' })
  async enviarMail(@Body() mail: EnviarMailDto) {
    try {
      const htmlContent = `
      <h1>Observaciones sobre su solicitud</h1>
      <p>${mail.mensaje}</p>
    `;
      console.log('Entro enviar email');

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

  @Post('enviar_email')
  @ApiOperation({ summary: 'Enviar mail sobre actualización o adición a su saldo vacacional' })
  @ApiBody({ description: 'Asunto, destinatario y mensaje a enviar' })
  async enviarMailSaldo(@Body() mail: MailDto) {
    try {
      const htmlContent = `
      <h1>${mail.asunto}</h1>
      <p>${mail.mensaje}</p>
    `;
      console.log('Entro enviar email');

      await this.mailService.sendMail(
        mail.destinatario,
        mail.asunto,
        htmlContent,
      );
      return true;
    } catch (error) {
      console.log(error);

      return 'Error al enviar el correo';
    }
  }

  @Post('email/rechazar/:destinatario')
  @ApiOperation({ summary: 'Enviar mail de solicitud rechazada' })
  @ApiParam({ name: 'Mail del empleado quién creó la solicitud' })
  @ApiResponse({
    status: 200,
    description: 'Mail enviado éxitosamente',
    type: Boolean,
    isArray: false,
  })
  async enviarMailRechazada(@Param('destinatario') destinatario: string) {
    try {
      const htmlContent = `
      <h1>Solicitud Rehazada</h1>
      <p>Su solicitud vacacional ha sido rechazada</p>
    `;
      console.log('Usuarios', destinatario);

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
  @ApiOperation({ summary: 'Enviar mail de solicitud aprobada' })
  @ApiParam({ name: 'Mail del empleado quién creó la solicitud' })
  @ApiResponse({
    status: 200,
    description: 'Mail enviado éxitosamente',
    type: Boolean,
    isArray: false,
  })
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
