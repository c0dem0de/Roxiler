import { IsString, Length, Matches } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  old_password: string;

  @IsString()
  @Length(8, 16, { message: 'Password must be between 8 and 16 characters' })
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>_])/, {
    message:
      'Password must include at least one uppercase letter and one special character',
  })
  new_password: string;

  @IsString()
  repeat_password: string;
}
