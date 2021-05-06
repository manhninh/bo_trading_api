import { IsIn, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateInternalTransferValidator {
  @IsNotEmpty({ message: 'User id is required' })
  user_id: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsNotEmpty({ message: 'To Wallet is required' })
  @IsIn(['spot', 'trade', 'expert', 'copytrade'])
  to_wallet: string;

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
