import { UserService } from 'src/user/user.service';
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { UpdatePasswordDto } from 'src/dtos/update-user-pwd.dto';
import { RoleGuard } from 'src/role.guard';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/constants';

@Controller('store')
@UseGuards(AuthGuard('jwt'), new RoleGuard(Roles.STORE))
export class StoreController {
  constructor(
    private readonly storeService: StoreService,
    private readonly userService: UserService,
  ) {}

  @Post('/resetpassword')
  async resetPassword(@Request() req: any, @Body() body: UpdatePasswordDto) {
    const email = req.user.email;
    const { old_password, new_password, repeat_password } = body;

    // Missing fields checking
    const missing: string[] = [];
    if (!old_password) missing.push('old password');
    if (!new_password) missing.push('new password');
    if (!repeat_password) missing.push('repeat password');

    if (missing.length > 0) {
      throw new BadRequestException(
        `Missing required field(s): ${missing.join(', ')}`,
      );
    }

    // Start reset process
    if (new_password === repeat_password) {
      const status = await this.userService.resetPassword(email, {
        old_password,
        new_password,
        repeat_password,
      });

      if (!status) {
        throw new BadRequestException();
      }
      return status;
    } else {
      throw new BadRequestException(
        'New password and repeat password do not match',
      );
    }
  }

  @Get('ratings/users')
  async getUsersWhoRated(@Request() req) {
    const storeId = req.user.id; // store's own id from JWT
    return this.storeService.getUsersWhoRated(storeId);
  }

  // Average rating for this store
  @Get('ratings/average')
  async getAverageRating(@Request() req) {
    const storeId = req.user.id; // store's own id from JWT
    return this.storeService.getAverageRating(storeId);
  }
}
