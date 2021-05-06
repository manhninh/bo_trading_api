import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateTransferValidator {
  @IsNotEmpty({ message: 'User id is required' })
  user_id: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @IsNotEmpty({ message: 'Amount is required' })
  @Min(Number(1))
  @IsNumber({}, {
    message: 'Amount is number',
  })
  amount: number;

  @IsOptional({})
  tfa: string;

  @IsNotEmpty({ message: 'Response is required' })
  response: string;
}
