import { Module } from '@nestjs/common';
import { EmpresaController } from './empresa.controller';
import { EmpresaService } from './empresa.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empresa } from './empresa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Empresa])],
  controllers: [EmpresaController],
  providers: [EmpresaService],
})
export class EmpresaModule {}
