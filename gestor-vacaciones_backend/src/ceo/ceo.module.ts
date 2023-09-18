import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ceo } from './ceo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ceo])],
})
export class CeoModule {}
