import { IsNumberString, MaxLength, ValidateIf } from 'class-validator';

export class UpdateUserValidator {
  @ValidateIf(o => o.full_name !== null && o.full_name !== undefined && o.full_name !== '')
  @MaxLength(200, {
    message: 'Full Name is too long',
  })
  full_name?: string;

  @ValidateIf(o => o.phone !== null && o.phone !== undefined && o.phone !== '')
  @IsNumberString({}, { message: 'Phone number must be number' })
  phone?: string;

  avatar?: string;
}
