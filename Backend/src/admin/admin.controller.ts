import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateUserByRoleDto } from 'src/dtos/create-user-by-role.dto';
import { RoleGuard } from 'src/role.guard';
import { Roles } from 'src/constants';
import { AuthGuard } from '@nestjs/passport';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), new RoleGuard(Roles.ADMIN))
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('adduser')
  async addUser(@Body() userData: CreateUserByRoleDto) {
    const resp = await this.adminService.addUserByRole(userData);

    if (!resp) {
      return { status: 'success', message: 'New user created' };
    }
    return resp;
  }

  @Get('dashboard')
  async getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('stores')
  async getStoresList() {
    return this.adminService.getStoresList();
  }

  @Get('users')
  async getUsersList(
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('address') address?: string,
    @Query('role') role?: string,
  ) {
    return this.adminService.getUsersList({ name, email, address, role });
  }
}
