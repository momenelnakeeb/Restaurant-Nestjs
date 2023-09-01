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
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  age: number;

  @IsEmail()
  email: string;

  @IsOptional()
  images?: object[];

  @IsEnum(Category)
  category: Category;
}
export class UpdateRestuarantDto extends CreateRestuarantDto {}
