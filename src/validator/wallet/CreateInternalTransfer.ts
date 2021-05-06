import { IsIn, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateInternalTransferValidator {
  @IsNotEmpty({ message: 'User id is required' })
  user_id: string;

  @IsNotEmpty({ message: 'To Wallet is required' })
  @IsIn(['spot', 'trade', 'expert', 'copytrade'])
  to_wallet: string;

  @IsNotEmpty({ message: 'Amount is required' })
  @Min(Number(1))
  @IsNumber({}, {
    message: 'Amount is number',
  })
  amount: number;

  @IsNotEmpty({ message: 'Response is required' })
  response: string;
}
