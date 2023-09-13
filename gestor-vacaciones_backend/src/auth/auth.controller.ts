import { Controller } from '@nestjs/common';
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
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private userService: AuthService) {}

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
}
