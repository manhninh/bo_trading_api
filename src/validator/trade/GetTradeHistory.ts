import { IsNotEmpty } from 'class-validator';

export class GetTradeHistoryValidator {
  constructor() {
    this.limit = 100;
  }

  // @IsNotEmpty({ message: 'From is required' })
  // from: Date;

  // @IsNotEmpty({ message: 'To is required' })
  // to: Date;

  type: number;

  page: number;
  limit: number;
}