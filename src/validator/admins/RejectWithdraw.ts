import { IsNotEmpty } from 'class-validator';

export class RejectWithdrawValidator {
  @IsNotEmpty({ message: 'Transaction Id is required' })
  transactionId: string;

  @IsNotEmpty({ message: 'UserId is required' })
  userId: string;

  note: string; //Reject with any reason (for admin)
}
