import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateTransferValidator {
  @IsNotEmpty({ message: 'User id is required' })
  user_id: string;

  @IsNotEmpty({ message: 'Username is required' })
  username: string;

  @IsNotEmpty({ message: 'Amount is required' })
  @Min(Number(1))
  @IsNumber({}, {
    message: 'Amount is number',
  })
  amount: number;

  @IsNotEmpty({ message: 'Response is required' })
  response: string;
}
