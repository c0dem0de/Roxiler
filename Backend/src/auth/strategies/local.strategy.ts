import { UserService } from 'src/user/user.service';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as brypt from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string) {
    // 1. Get user details
    const user = await this.userService.findUserByEmail(email);

    // 2. If user not found, then unauthorised user
    if (user === undefined || user == null)
      throw new UnauthorizedException({
        status: 'fail',
        message: 'User not found',
      });

    // 3. Match password
    const isMatch = await brypt.compare(password, user.password);

    // 4. If user password match and user exists return user
    if (user != undefined && isMatch) {
      const { password, ...rest } = user;
      return { ...rest };
    } else {
      throw new UnauthorizedException({
        status: 'fail',
        message: 'Incorrect Password',
      });
    }
  }
}
