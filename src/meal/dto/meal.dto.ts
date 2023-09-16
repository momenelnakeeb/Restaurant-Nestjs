// meal.dto.ts
import {
  IsString,
  // IsNumber,
  IsOptional,
  IsNumberString,
} from 'class-validator';

export class CreateMealDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsNumberString()
  readonly price: number;

  @IsString()
  readonly restaurantId: string; // Assuming you provide the restaurant's ID when creating a meal

  // @IsString()
  // createdBy: string;
  @IsOptional()
  readonly image?: Express.Multer.File; // Make the image field optional
}

export class UpdateMealDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsNumberString()
  @IsOptional()
  readonly price?: number;

  @IsString()
  @IsOptional()
  createdBy?: string;
  @IsString() // Include the restaurantId field to update restaurant information
  @IsOptional()
  readonly restaurantId?: string;

  @IsOptional()
  image?: Express.Multer.File; // Make the image field optional
}
