import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SuperadModule } from './superad/superad.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from './config/typeorm.config';
import { AdminModule } from './admin/admin.module';
import { UsuarioModule } from './usuario/usuario.module';
import { RolesModule } from './roles/roles.module';
import { SolicitudModule } from './solicitud/solicitud.module';
import { EmpresaModule } from './empresa/empresa.module';
import { DepartamentoModule } from './departamento/departamento.module';
import { SaldoVacacionalModule } from './saldo-vacacional/saldo-vacacional.module';
import { TrabajadorModule } from './trabajador/trabajador.module';
import { EmpleadoModule } from './empleado/empleado.module';
import { AuthModule } from './auth/auth.module';
import { CeoModule } from './ceo/ceo.module';
import { EmailService } from './email/email.service';
import { SecurityService } from './security/security.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    SuperadModule,
    AdminModule,
    UsuarioModule,
    RolesModule,
    SolicitudModule,
    EmpresaModule,
    DepartamentoModule,
    SaldoVacacionalModule,
    TrabajadorModule,
    EmpleadoModule,
    AuthModule,
    CeoModule,
  ],
  controllers: [AppController],
  providers: [AppService, EmailService, SecurityService],
})
export class AppModule {}
