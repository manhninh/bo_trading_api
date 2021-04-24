import { IsNotEmpty } from 'class-validator';

export class GetTransactionsHistoryValidator {
  constructor() {
    this.limit = 10;
    this.type = 0;
  }

  @IsNotEmpty({ message: 'From is required' })
  from: Date;

  @IsNotEmpty({ message: 'To is required' })
  to: Date;

  page: number;
  limit: number;
  user_id: number;
  type: number;
}
