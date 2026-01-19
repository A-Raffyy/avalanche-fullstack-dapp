import { Body, Controller, Get, Post } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { from } from 'rxjs';
import { GetEventDto } from './dto/get-event.dto';

@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  // GET /blockchain/value
  @Get('value')
  async getValue() {
    return this.blockchainService.getLatestValue();
  }

  // POST /blockchain/events
  @Post('events')
  async getEvents(@Body() body: GetEventDto) {
    return this.blockchainService.getValueUpdatedEvents(
      body.fromBlock,
      body.toBlock,
    );
  }
}
