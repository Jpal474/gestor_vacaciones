import { Module } from '@nestjs/common';
import { SaldoVacacionalController } from './saldo-vacacional.controller';
import { SaldoVacacionalService } from './saldo-vacacional.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaldoVacacional } from './saldo-vacacional.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SaldoVacacional])],
  controllers: [SaldoVacacionalController],
  providers: [SaldoVacacionalService],
})
export class SaldoVacacionalModule {}
