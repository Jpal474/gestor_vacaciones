import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ceo } from './ceo.entity';
import { CeoService } from './ceo.service';
import { CeoController } from './ceo.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Ceo])],
  providers: [CeoService],
  controllers: [CeoController],
})
export class CeoModule {}
