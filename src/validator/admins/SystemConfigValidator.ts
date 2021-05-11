import { IsNotEmpty } from 'class-validator';

export class SystemConfigValidator {
  @IsNotEmpty({ message: 'System key is required' })
  key: string;

  @IsNotEmpty({ message: 'System value 2 is required' })
  value: string;
}
