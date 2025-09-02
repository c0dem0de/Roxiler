import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  BadRequestException,
  Get,
  Query,
  Param,
  Patch,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/role.guard';
import { Roles } from 'src/constants';
import { UpdatePasswordDto } from 'src/dtos/update-user-pwd.dto';
import { CreateRatingDto } from 'src/dtos/create-user-rating.dto';

@Controller('user')
@UseGuards(AuthGuard('jwt'), new RoleGuard(Roles.USER))
export class UserController {
  constructor(private readonly userService: UserService) {}

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

  @Get('stores')
  async getStores(@Request() req: any, @Query('q') search?: string) {
    const userId = req.user.id;
    return this.userService.getStores(userId, search);
  }

  @Post('rate/:storeId')
  async rateStore(
    @Param('storeId') storeId: number,
    @Request() req: any,
    @Body() body: CreateRatingDto,
  ) {
    const userId = req.user.id; // from JWT auth
    const score = body.score;

    if (!score) {
      throw new BadRequestException('Score is required');
    }

    return this.userService.rateStore(userId, +storeId, score);
  }

  @Patch('rate/:storeId')
  async updateRating(
    @Param('storeId') storeId: number,
    @Request() req: any,
    @Body() body: CreateRatingDto,
  ) {
    const userId = req.user.id;

    const existing = await this.userService.findUserRating(userId, +storeId);
    if (!existing) {
      throw new NotFoundException('You have not rated this store yet');
    }

    return this.userService.rateStore(userId, +storeId, body.score);
  }

  // @Get('stores/search')
  // searchStores(@Query('q') q: string) {
  //   return this.userService.getStoresBy();
  // }
}
