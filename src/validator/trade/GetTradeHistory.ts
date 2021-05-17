import { IsNotEmpty } from 'class-validator';

export class GetTradeHistoryValidator {
  constructor() {
    this.limit = 5;
  }

  @IsNotEmpty({ message: 'From is required' })
  from: Date;

  @IsNotEmpty({ message: 'To is required' })
  to: Date;

  page: number;
  limit: number;
}
