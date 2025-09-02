import { IsEmail, IsString, Length, Matches, MaxLength } from 'class-validator';

export class CreateUserByRoleDto {
  @IsString()
  @Length(20, 60, { message: 'Name must be between 20 and 60 characters' })
  name: string;

  @IsString()
  @MaxLength(400, { message: 'Address must not exceed 400 characters' })
  address: string;

  @IsString()
  @Length(8, 16, { message: 'Password must be between 8 and 16 characters' })
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>_])/, {
    message:
      'Password must include at least one uppercase letter and one special character',
  })
  password: string;

  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsString()
  role: string;
}
