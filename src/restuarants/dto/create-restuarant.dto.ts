/* eslint-disable prettier/prettier */
import {
  IsNotEmpty,
  IsNumber,
  IsEmail,
  IsOptional,
  IsEnum,
  IsString,
} from 'class-validator';
import { Category } from '../schema/restuarant.schema';

export class CreateRestuarantDto {
  // @IsNotEmpty()
  // @IsString()
  name: string;

  // @IsNotEmpty()
  // @IsNumber()
  age: number;

  // @IsNotEmpty()
  // @IsEmail()
  email: string;

  images?: object[];
  // @IsOptional()
  // @IsString()
  file?: string;

  // @IsEnum(Category)
  category: Category;
}

export class UpdateRestuarantDto extends CreateRestuarantDto {}
