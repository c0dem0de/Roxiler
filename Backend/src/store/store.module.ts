import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { StoreController } from './store.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Ratings } from 'src/entities/ratings.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule,
    UserModule,
    JwtModule,
    TypeOrmModule.forFeature([User, Ratings]),
  ],
  controllers: [StoreController],
  providers: [StoreService],
})
export class StoreModule {}
