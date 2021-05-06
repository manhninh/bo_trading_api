import config from '@src/config';
import wallet from '@src/config/wallet';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateWithdrawERC20Validator {
  @IsNotEmpty({ message: 'User id is required' })
  user_id: string;

  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsNotEmpty({ message: 'Receiver address is required' })
  address: string;

  @IsNotEmpty({ message: 'Amount is required' })
  @Min(Number(wallet.ETH_ERC20_WITHDRAW_MIN_AMOUNT))
  @IsNumber({}, {
    message: 'Amount is number and large than ' + wallet.ETH_ERC20_WITHDRAW_MIN_AMOUNT,
  })
  amount: number;

  @IsOptional({})
  tfa: string;

  @IsNotEmpty({ message: 'Symbol is required' })
  @IsIn([config.ETH_ERC20_SYMBOL])
  symbol: string;
}
