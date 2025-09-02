import { IsInt, Min, Max } from 'class-validator';

export class CreateRatingDto {
  @IsInt()
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating cannot be more than 5' })
  score: number;
}
