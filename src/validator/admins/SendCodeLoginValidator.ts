import {IsNotEmpty} from 'class-validator';

export class SendCodeLoginValidator {
  @IsNotEmpty({message: 'Email is required'})
  email: string;
}
