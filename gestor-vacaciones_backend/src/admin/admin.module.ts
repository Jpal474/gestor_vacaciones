import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/usuario/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
