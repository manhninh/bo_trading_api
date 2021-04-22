import { IsNotEmpty, MaxLength, MinLength, ValidateIf } from 'class-validator';

export class ChangePasswordUserValidator {
  current_password?: string;

  @ValidateIf(o => o.current_password !== null && o.current_password !== undefined && o.current_password !== '')
  @IsNotEmpty({ message: 'New Password is required' })
  @MinLength(6, {
    message: 'New Password must be at least 6 characters!',
  })
  @MaxLength(20, {
    message: 'New Password must be at most 20 characters!',
  })
  new_password?: string;
}
