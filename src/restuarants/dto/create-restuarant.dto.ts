/* eslint-disable prettier/prettier */
import {
  IsNotEmpty,
  // IsNumber,
  IsEmail,
  IsOptional,
  IsEnum,
  IsString,
} from 'class-validator';
import { Category } from '../schema/restuarant.schema';
// import { User } from 'src/auth/user.schema';
import { Express } from 'express'; // Import Express type

export class CreateRestuarantDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  // @IsNotEmpty()
  // @IsNumber()
  // age: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  images?: object[];

  @IsOptional()
  file?: Express.Multer.File; // Use Express.Multer.File type

  @IsEnum(Category)
  category: Category;

  createdByUserId: string;
}

export class UpdateRestuarantDto extends CreateRestuarantDto {}
