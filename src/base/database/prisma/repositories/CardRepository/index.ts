import { PrismaService } from 'src/base/database/prisma.service';
import { AbstractCardRepository } from '../';
import { Injectable } from '@nestjs/common';
import { Card } from '@prisma/client';

@Injectable()
export class CardRepository implements AbstractCardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createCard(cardUid: string, userId?: string): Promise<void> {
    await this.prisma.card.create({
      data: {
        cardUid,
        userId,
      },
    });
    return;
  }

  async getAllCards(): Promise<Card[]> {
    return await this.prisma.card.findMany();
  }

  async findByCardUid(cardUid: string): Promise<Card> {
    return await this.prisma.card.findUnique({ where: { cardUid } });
  }

  async findByUserId(userId: string): Promise<Card[]> {
    return await this.prisma.card.findMany({ where: { userId } });
  }

  async updateCard(cardUid: string, userId: string): Promise<void> {
    await this.prisma.card.update({ where: { cardUid }, data: { userId } });
    return;
  }

  async deleteCard(cardUid: string): Promise<void> {
    await this.prisma.card.delete({ where: { cardUid } });
    return;
  }
}
