/* eslint-disable prettier/prettier */
// update-user.dto.ts
// import { Exclude } from 'class-transformer';
import { IsOptional, IsString, IsEmail } from 'class-validator';
// import { User } from '../user.schema';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  readonly name: string;

  @IsEmail()
  @IsOptional()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly newPassword: string;

  @IsOptional()
  @IsString()
  file?: string; // Use Express.Multer.File type for file uploads;
}
