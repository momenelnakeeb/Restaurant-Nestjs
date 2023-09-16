/* eslint-disable prettier/prettier */
// signup.dto.ts

import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  file?: Express.Multer.File; // Use Express.Multer.File type for file uploads;

  @IsOptional()
  role?: 'admin' | 'user'; // Include the 'role' field
}
