import { IsString, IsNotEmpty } from 'class-validator';

export class DeviceNameDto {
  @IsString()
  @IsNotEmpty()
  deviceName: string;
}
