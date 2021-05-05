import {IsNotEmpty, IsString} from 'class-validator';

export class VerifyOTPTokenValidator {
  @IsNotEmpty({message: 'UserId is required'})
  userId: string;

  @IsNotEmpty({message: 'Verify email is required'})
  @IsString({
    message: 'Verify email is string',
  })
  password: string;

  @IsNotEmpty({message: 'code is required'})
  @IsString({
    message: 'code is string',
  })
  code: string;

  secret?: string;

  disabled?: boolean;
}
