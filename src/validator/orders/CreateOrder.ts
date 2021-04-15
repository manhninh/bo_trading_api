import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOrderValidator {
  @IsNotEmpty({ message: 'User id is required' })
  userId: string;

  @IsNotEmpty({ message: 'Type user is required' })
  @IsNumber({}, {
    message: 'Type user is number',
  })
  typeUser: number;

  @IsNotEmpty({ message: 'Type order is required' })
  @IsNumber({}, {
    message: 'Type order is number',
  })
  typeOrder: number;

  @IsNotEmpty({ message: 'Amount is required' })
  @IsNumber({}, {
    message: 'Amount is number',
  })
  amount: number;
}
