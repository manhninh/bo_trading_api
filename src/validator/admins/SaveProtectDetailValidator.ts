import {IsNotEmpty, IsString} from 'class-validator';

export class SaveProtectDetailValidator {
  @IsNotEmpty({message: 'Protect leve 1 is required'})
  protectLevel1: number;

  @IsNotEmpty({message: 'Protect leve 2 is required'})
  protectLevel2: number;

  @IsNotEmpty({message: 'Protect leve 3 is required'})
  protectLevel3: number;

  @IsNotEmpty({message: 'Protect leve 4 is required'})
  protectLevel4: number;
}
