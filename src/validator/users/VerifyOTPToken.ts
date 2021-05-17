import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyOTPTokenValidator {
  @IsNotEmpty({ message: 'password is required' })
  @IsString({
    message: 'password is string',
  })
  password: string;

  @IsNotEmpty({ message: 'code is required' })
  @IsString({
    message: 'code is string',
  })
  code: string;

  secret?: string;
}