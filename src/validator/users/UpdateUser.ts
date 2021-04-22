import { IsEmail, IsNotEmpty, IsNumberString, IsString, MaxLength, ValidateIf } from 'class-validator';

export class UpdateUserValidator {
  @IsNotEmpty({ message: 'Username is required' })
  @MaxLength(200, {
    message: 'Username is too long',
  })
  @IsString({
    message: 'Username is string',
  })
  username: string;

  @IsEmail({}, { message: 'Email invalidate' })
  @MaxLength(200, {
    message: 'Email is too long',
  })
  email: string;

  @ValidateIf(o => o.full_name !== null && o.full_name !== undefined && o.full_name !== '')
  @MaxLength(200, {
    message: 'Full Name is too long',
  })
  full_name?: string;

  @ValidateIf(o => o.phone !== null && o.phone !== undefined && o.phone !== '')
  @IsNumberString({}, { message: 'Phone number must be number' })
  phone?: string;

  avatar?: object;


}
