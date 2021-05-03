import { IsNotEmpty, IsString } from 'class-validator';

export class SendCodeValidator {
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}