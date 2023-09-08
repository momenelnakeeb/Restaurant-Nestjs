/* eslint-disable prettier/prettier */
// update-user.dto.ts
// import { Exclude } from 'class-transformer';
// import { ApiPropertyOptional } from '@nestjs/swagger';
// import { Exclude } from 'class-transformer';
import { IsOptional, IsString, IsEmail } from 'class-validator';
// import { User } from '../user.schema';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  readonly name?: string; // Make the properties optional

  @IsEmail()
  @IsOptional()
  readonly email?: string; // Make the properties optional

 
  @IsOptional()
  @IsString()
 
  readonly newPassword?: string; // Make the properties optional

  @IsOptional()
  @IsString()
  file?: string; // Use Express.Multer.File type for file uploads;

  
}
