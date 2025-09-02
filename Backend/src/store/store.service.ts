import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Ratings } from 'src/entities/ratings.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StoreService {
  constructor(
    @InjectRepository(Ratings)
    private ratingsRepository: Repository<Ratings>,
  ) {}

  async getUsersWhoRated(storeId: number) {
    const ratings = await this.ratingsRepository.find({
      where: { store: { id: storeId } },
      relations: ['user'],
    });

    return ratings.map((r) => ({
      userId: r.user.id,
      name: r.user.name,
      email: r.user.email,
      score: r.score,
    }));
  }

  async getAverageRating(storeId: number) {
    const ratings = await this.ratingsRepository.find({
      where: { store: { id: storeId } },
    });

    if (!ratings.length) {
      return { storeId, averageRating: 0 };
    }

    const avg = ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length;

    return {
      storeId,
      averageRating: Number(avg.toFixed(1)), // 1 decimal place
    };
  }
}
