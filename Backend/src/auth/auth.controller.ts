import { Controller, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/dtos/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(AuthGuard('local'))
  logUser(@Request() req: any) {
    return this.authService.login(req.user);
  }

  @Post('register')
  registerUser(@Body() userData: CreateUserDto) {
    return this.authService.register(userData);
  }
}
