import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserByRoleDto } from 'src/dtos/create-user-by-role.dto';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Roles, SALT_ROUNDS } from 'src/constants';
import { UserService } from 'src/user/user.service';
import { Ratings } from 'src/entities/ratings.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Ratings)
    private readonly ratingsRepository: Repository<Ratings>,
    private readonly userService: UserService,
  ) {}

  async addUserByRole(body: CreateUserByRoleDto) {
    const user = await this.userService.findUserByEmail(body.email);
    // Verify user does not already exist
    if (!user) {
      // hash and save password
      const hashed_pass = await bcrypt.hash(body.password, SALT_ROUNDS);
      body.password = hashed_pass;

      // set user details
      const user = new User();
      user.name = body.name;
      user.email = body.email;
      user.password = body.password;
      user.address = body.address;
      user.role = body.role;

      const newUser = await this.userRepository.save(user);

      // check if new user created successfully
      if (!newUser || !('id' in newUser) || !newUser.id) {
        return { status: 'fail', message: 'User cannot be created' };
      } else {
        return null;
      }
    } else {
      return { status: 'fail', message: 'User already exists' };
    }
  }

  async getDashboardStats() {
    const totalUsers = await this.userRepository.count({
      where: { role: Roles.USER },
    });
    const totalStores = await this.userRepository.count({
      where: { role: Roles.STORE },
    });
    const totalRatings = await this.ratingsRepository.count();

    return { totalUsers, totalStores, totalRatings };
  }

  async getStoresList() {
    const stores = await this.userRepository.find({
      where: { role: Roles.STORE },
      relations: ['receivedRatings'],
    });

    return stores.map((store) => {
      const ratings = store.receivedRatings || [];
      const avg =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length
          : 0;

      return {
        name: store.name,
        email: store.email,
        address: store.address,
        rating: Number(avg.toFixed(1)),
      };
    });
  }

  async getUsersList(filters?: {
    name?: string;
    email?: string;
    address?: string;
    role?: string;
  }) {
    const qb = this.userRepository.createQueryBuilder('user').where('1=1');

    if (filters?.name) {
      qb.andWhere('LOWER(user.name) LIKE :name', {
        name: `%${filters.name.toLowerCase()}%`,
      });
    }

    if (filters?.email) {
      qb.andWhere('LOWER(user.email) LIKE :email', {
        email: `%${filters.email.toLowerCase()}%`,
      });
    }

    if (filters?.address) {
      qb.andWhere('LOWER(user.address) LIKE :address', {
        address: `%${filters.address.toLowerCase()}%`,
      });
    }

    if (filters?.role) {
      qb.andWhere('LOWER(user.role) LIKE :role', {
        role: `%${filters.role.toLowerCase()}%`,
      });
    }

    return qb
      .select([
        'user.id',
        'user.name',
        'user.email',
        'user.address',
        'user.role',
      ])
      .getMany();
  }
}
