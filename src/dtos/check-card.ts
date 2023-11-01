import { IsNotEmpty, IsString } from 'class-validator';

export class CheckCardDto {
  @IsNotEmpty()
  @IsString()
  cardUid: string;
}
