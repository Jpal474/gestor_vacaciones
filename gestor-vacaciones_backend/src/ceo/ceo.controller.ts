import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { Ceo } from './ceo.entity';
import { CeoService } from './ceo.service';
import { UpdateCeoDto } from './dto/update-ceo.dto';

@Controller('ceo')
export class CeoController {
  constructor(private ceoService: CeoService) {}

  @Get('/:id')
  getCeoById(@Param('id') id: string): Promise<Ceo> {
    return this.ceoService.getCeoById(id);
  }

  @Get('usuario/:id')
  getCeoByUserId(@Param('id') id: string): Promise<Ceo> {
    return this.ceoService.getCeoByUserId(id);
  }

  @Put('/:id')
  updateCeo(
    @Param('id') id: string,
    @Body() updateCeoDto: UpdateCeoDto,
  ): Promise<Ceo> {
    return this.ceoService.updateCeo(id, updateCeoDto);
  }
}
