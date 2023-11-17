import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CheckCardDto } from 'src/common/dtos/CheckCard';
import { AbstractCardRepository } from '../repositories';

@Controller('api/card')
export class CardController {
  constructor(private cardRepository: AbstractCardRepository) {}

  @Post('check')
  async checkcard(
    @Body() body: CheckCardDto,
    @Res() res: Response,
  ): Promise<Response> {
    const { cardUid } = body;

    const card = await this.cardRepository.findByCardUid(cardUid);
    if (!card) {
      return res.status(404).json({ message: 'Blocked' });
    }
    return res.status(200).json({ message: 'Authorized' });
  }
}
