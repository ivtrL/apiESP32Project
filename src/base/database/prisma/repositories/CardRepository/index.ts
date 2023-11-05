import { PrismaService } from 'src/base/database/prisma.service';
import { AbstractCardRepository } from '../';
import { Injectable } from '@nestjs/common';
import { Card } from '@prisma/client';

@Injectable()
export class CardRepository implements AbstractCardRepository {
  constructor(private readonly prisma: PrismaService) {}

  createCard(cardUid: string, userId?: string): Promise<void> {
    this.prisma.card.create({
      data: {
        cardUid,
        userId,
      },
    });
    return;
  }

  getAllCards(): Promise<Card[]> {
    return this.prisma.card.findMany();
  }

  findByCardUid(cardUid: string): Promise<Card> {
    return this.prisma.card.findUnique({ where: { cardUid } });
  }

  findByUserId(userId: string): Promise<Card[]> {
    return this.prisma.card.findMany({ where: { userId } });
  }

  updateCard(cardUid: string, userId: string): Promise<void> {
    this.prisma.card.update({ where: { cardUid }, data: { userId } });
    return;
  }

  deleteCard(cardUid: string): Promise<void> {
    this.prisma.card.delete({ where: { cardUid } });
    return;
  }
}
