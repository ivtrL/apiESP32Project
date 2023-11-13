/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CheckCardDto } from 'src/common/dtos/CheckCard';
import { CardRepository } from '../repositories/prisma/CardRepository';

@Controller('api/card')
export class CardController {
  constructor(private CardRepository: CardRepository) {}

  @Post('')
  async postCheckCard(
    @Body() body: CheckCardDto,
    @Res() res: Response,
  ): Promise<Response> {
    const { cardUid } = body;
    const card = await this.CardRepository.findByCardUid(cardUid);
    if (!card) {
      return res.status(404).send();
    }
    return res.status(200).send();
  }
}
