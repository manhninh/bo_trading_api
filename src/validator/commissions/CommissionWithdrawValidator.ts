import {IsNotEmpty, IsString} from 'class-validator';

export class CommissionWithdrawValidator {
  @IsNotEmpty({message: 'UserId is required'})
  @IsString({
    message: 'UserId is string',
  })
  userId: string;

  @IsNotEmpty({message: 'TypeCommission is required'})
  typeComission: number;

  @IsNotEmpty({message: 'FromDate is required'})
  date: Date;
}
