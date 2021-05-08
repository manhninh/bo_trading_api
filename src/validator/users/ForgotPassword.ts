import {IsEmail, MaxLength} from 'class-validator';

export class ForgotPasswordValidator {
  @IsEmail({}, {message: 'Email invalidate'})
  @MaxLength(200, {
    message: 'Email is too long',
  })
  email: string;
}
