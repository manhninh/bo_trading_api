import config from '@src/config';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateWithdrawValidator {
  @IsNotEmpty({ message: 'User id is required' })
  user_id: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsNotEmpty({ message: 'Receiver address is required' })
  address: string;

  @IsNotEmpty({ message: 'Amount is required' })
  @Min(Number(config.TRON_TRC20_DEPOSIT_MIN_AMOUNT))
  @IsNumber({}, {
    message: 'Amount is number and large than 20',
  })
  amount: number;

  @IsOptional({})
  tfa: string;

  @IsNotEmpty({ message: 'Symbol is required' })
  @IsIn([config.TRON_TRC20_SYMBOL])
  symbol: string;
}
