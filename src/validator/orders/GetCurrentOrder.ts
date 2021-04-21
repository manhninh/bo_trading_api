import {IsNotEmpty, IsNumber} from 'class-validator';

export class GetCurrentOrderValidator {
  @IsNotEmpty({message: 'userid is required'})
  userId: string;

  @IsNotEmpty({message: 'typeUser is required'})
  @IsNumber(
    {},
    {
      message: 'Type user is number',
    },
  )
  typeUser: number;
}
