import { IsEmail, IsString } from 'class-validator';

export class EditUserDto {
  @IsString()
  @IsEmail()
  email?: string;

  @IsString()
  name?: string;

  @IsString()
  password?: string;
}
