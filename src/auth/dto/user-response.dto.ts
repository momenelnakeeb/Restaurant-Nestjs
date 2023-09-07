/* eslint-disable prettier/prettier */
// auth/dto/user-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserResponseDto {
  @ApiProperty()
  @Expose()
   _id: string;

  @ApiProperty()
  @Expose()
   email: string;

  @ApiProperty()
  @Expose()
   name: string;

  @ApiProperty()
  @Expose()
   file: string;

  @ApiProperty()
  @Expose()
   __v: number;
}
