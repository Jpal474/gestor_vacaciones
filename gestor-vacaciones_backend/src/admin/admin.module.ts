import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Empleado } from 'src/empleado/empleado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Empleado])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
