import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dtos/create-user.dto';
import { UpdatePasswordDto } from 'src/dtos/update-user-pwd.dto';
import { User } from 'src/entities/user.entity';
import { Like, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Roles, SALT_ROUNDS } from 'src/constants';
import { Ratings } from 'src/entities/ratings.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Ratings)
    private ratingsRepo: Repository<Ratings>,
  ) {}

  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email },
      select: ['id', 'email', 'password', 'role'],
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async saveUser(body: CreateUserDto) {
    let user = new User();
    user.email = body.email;
    user.password = body.password;
    user.name = body.name;
    user.address = body.address;
    user = await this.userRepository.save(user);
    const { name, password, address, ...rest } = user;
    return { ...rest };
  }

  async resetPassword(email: string, body: UpdatePasswordDto) {
    // 1. Verify user exist
    let user = await this.userRepository.findOne({
      where: { email: email },
      select: ['id', 'email', 'password', 'role'],
    });
    if (!user) {
      return { status: 'fail', message: 'User not found' };
    }

    // 2. Verify user password
    const match = await bcrypt.compare(body.old_password, user.password);

    // 3. Set new hashed password
    if (match) {
      user.password = await bcrypt.hash(body.new_password, SALT_ROUNDS);
      user = await this.userRepository.save(user);
      // delete user.password;
      return user ? { status: 'success' } : null;
    }
    return { status: 'fail', message: 'Old password is incorrect' };
  }

  async getStores(userId: number, search?: string) {
    const stores = await this.userRepository.find({
      where: search
        ? [
            { role: Roles.STORE, name: Like(`%${search}%`) },
            { role: Roles.STORE, address: Like(`%${search}%`) },
          ]
        : { role: Roles.STORE },
      relations: ['receivedRatings', 'receivedRatings.user'],
    });

    return stores.map((store) => {
      const ratings = store.receivedRatings || [];

      // overall rating (avg)
      const avg =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length
          : 0;

      // current user's rating
      const userRating =
        ratings.find((r) => r.user.id === userId)?.score ?? null;

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        overallRating: Number(avg.toFixed(1)), // 1 decimal place
        userRating,
      };
    });
  }

  async findUserRating(userId: number, storeId: number) {
    return this.ratingsRepo.findOne({
      where: { user: { id: userId }, store: { id: storeId } },
      relations: ['user', 'store'],
    });
  }

  async rateStore(userId: number, storeId: number, score: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const store = await this.userRepository.findOne({ where: { id: storeId } });

    if (!user || !store) throw new NotFoundException('User or Store not found');

    let rating = await this.findUserRating(userId, storeId);

    if (rating) {
      rating.score = score; // update
    } else {
      rating = this.ratingsRepo.create({ user, store, score }); // create
    }

    return this.ratingsRepo.save(rating);
  }
}
