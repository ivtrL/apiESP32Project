import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { CheckCardDto } from 'src/common/dtos/CheckCard';
import {
  AbstractCardRepository,
  AbstractLogRepository,
  AbstractTimeRepository,
} from '../repositories';
import { randomBytes } from 'node:crypto';
@Controller('api/card')
export class CardController {
  constructor(
    private cardRepository: AbstractCardRepository,
    private logRepository: AbstractLogRepository,
    private timeRepository: AbstractTimeRepository,
  ) {}

  @Post('check')
  async checkcard(
    @Body() body: CheckCardDto,
    @Res() res: Response,
  ): Promise<Response> {
    const { cardUid, deviceUid } = body;
    console.log(cardUid);
    const card = await this.cardRepository.findByCardUid(cardUid);
    console.log(card);
    if (!card) {
      const logId = randomBytes(64).toString('hex');
      await this.logRepository.createLog(logId, deviceUid, false);
      return res.status(404).json({ message: 'Blocked' });
    }
    const logArray = await this.logRepository.getLatestAuthorizedLog(cardUid);
    if (logArray.length === 0) {
      const logId = randomBytes(64).toString('hex');
      await this.logRepository.createLog(logId, deviceUid, true, cardUid);
      await this.timeRepository.createTime(logId, false);
      return res.status(200).json({ message: 'Authorized' });
    }
    const log = logArray[0];
    const logTimes = await this.timeRepository.findByLogId(log.logId);
    if (logTimes.length === 0) {
      await this.timeRepository.createTime(log.logId, false);
      return res.status(200).json({ message: 'Authorized' });
    }
    if (logTimes.length < 2) {
      await this.timeRepository.createTime(log.logId, true);
      return res.status(200).json({ message: 'Authorized' });
    }
    const logId = randomBytes(64).toString('hex');
    await this.logRepository.createLog(logId, deviceUid, true, cardUid);
    await this.timeRepository.createTime(logId, false);
    return res.status(200).json({ message: 'Authorized' });
  }

  @Post('create')
  async createCard(
    @Body() body: { cardUid: string; userId?: string },
    @Res() res: Response,
  ): Promise<Response> {
    const { cardUid, userId } = body;
    await this.cardRepository.createCard(cardUid, userId);
    return res.status(201).json({ message: 'Card created' });
  }
}
