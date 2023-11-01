import { Controller, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Post, Body } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthCredentialDto } from './dto/auth-credentials-dto';
import { EmailService } from 'src/email/email.service';
import { SecurityService } from 'src/security/security.service';
import { TokenDto } from './dto/token.dto';
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  URL = 'http://localhost:4200';
  constructor(
    private userService: AuthService,
    private mailService: EmailService,
    private securityService: SecurityService,
  ) {}

  @Post('/signin')
  @ApiOperation({ summary: 'Inicio de Sesión' })
  @ApiBody({
    description: 'Datos para autenticación del usuario',
    type: AuthCredentialDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Regresa un token de autorización',
    isArray: false,
    type: String,
  })
  signIn(
    @Body() authCredentialsDto: AuthCredentialDto,
  ): Promise<{ accessToken: string }> {
    return this.userService.signIn(authCredentialsDto);
  }

  @ApiOperation({ summary: 'Cambio de contraseña' })
  @ApiBody({
    description: 'Contraseña nueva',
    type: TokenDto,
  })
  @ApiParam({
    name: 'ID',
    description: 'ID del usuario al cual cambiar la contraseña',
  })
  @Post('password/:id')
  changePassword(
    @Param('id') id: string,
    @Body() token: TokenDto,
  ): Promise<boolean> {
    return this.userService.changePassword(id, token);
  }

  @ApiOperation({ summary: 'Enviar correo para cambiar contraseña' })
  @ApiParam({
    name: 'Destinatario',
    description: 'Correo del usuario que ha pedido el cambio de vacaciones ',
  })
  @ApiResponse({
    status: 200,
    description: 'El mail ha sido enviado de forma correcta',
    type: Boolean,
  })
  @Post('email/:destinatario')
  async enviarMail(@Param('destinatario') destinatario: string) {
    try {
      const usuario = await this.userService.findUserByMail(destinatario);
      const datos_a_encriptar = {
        id: usuario.id,
        correo: usuario.correo,
      };

      const token = encodeURIComponent(
        await this.securityService.encrypt(datos_a_encriptar),
      );

      const htmlContent = `
      <h1>Solicitud de Cambio de Contraseña</h1>
      <p>Se ha solicitado un cambio de contraseña para su cuenta, para continuar, de clic en el enlace de abajo</p>
      <a class = 'btn btn-primary' href='${this.URL}/cambiar_contra/${token}' > Cambiar Contraseña </a>
      <br>
       <p>En caso de no haber sido usted, ignore este correo</p>`;
      console.log('Entro enviar email');

      await this.mailService.sendMail(
        destinatario,
        'Cambio de Contraseña',
        htmlContent,
      );
      return true;
    } catch (error) {
      return 'Error al enviar el correo';
    }
  }
}
