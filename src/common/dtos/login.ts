import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class Login {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
