import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UserTokenDto } from 'src/dtos/create-user-token.dto';
import { SALT_ROUNDS } from 'src/constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  generateToken(payload: UserTokenDto): string {
    return this.jwtService.sign({ ...payload });
  }

  login(user: any) {
    const access_token = this.generateToken(user);
    return {
      role: user.role,
      accessToken: access_token,
    };
  }

  async register(body: CreateUserDto) {
    const user = await this.userService.findUserByEmail(body.email);
    // Verify user does not already exist
    if (!user) {
      // hash and save password
      const hashed_pass = await bcrypt.hash(body.password, SALT_ROUNDS);
      body.password = hashed_pass;
      const newUser = await this.userService.saveUser(body);

      // check if new user created successfully
      if (!newUser || !('id' in newUser) || !newUser.id) {
        return { status: 'fail', message: 'User cannot be created' };
      }

      // get user an access key
      const access_token = this.generateToken(newUser);
      return access_token;
    } else {
      return { status: 'fail', message: 'User already exists' };
    }
  }
}
