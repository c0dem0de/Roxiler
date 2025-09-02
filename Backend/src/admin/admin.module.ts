import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { Ratings } from 'src/entities/ratings.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Ratings]),
    AuthModule,
    UserModule,
    JwtModule,
  ],
  controllers: [AdminController],
  providers: [AdminService, AuthService],
})
export class AdminModule {}
