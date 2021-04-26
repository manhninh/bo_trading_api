import {IsNotEmpty, IsString} from 'class-validator';

export class CommissionWithdrawHistoryValidator {
  constructor() {
    this.limit = 50;
  }
  @IsNotEmpty({message: 'UserId is required'})
  @IsString({
    message: 'UserId is string',
  })
  userId: string;

  @IsNotEmpty({message: 'FromDate is required'})
  fromDate: Date;

  @IsNotEmpty({message: 'ToDate is required'})
  toDate: Date;

  page: number;
  limit: number;
}
