import { IsNotEmpty } from 'class-validator';

export class ConfirmWithdrawValidator {
  @IsNotEmpty({ message: 'Transaction Id is required' })
  transactionId: string;

  @IsNotEmpty({ message: 'UserId is required' })
  userId: string;
}
