// auth.controller.ts

import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from 'src/auth/signup.dto';
import { SignInDto } from './signin.dto';
import { LocalStrategy } from './strategies/local.strategy';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cloudinaryService: CloudinaryService, // Inject CloudinaryService
  ) {}

  @Post('signup')
  @UseInterceptors(FileInterceptor('file')) // Use the FileInterceptor to handle file uploads
  async signUp(
    @Body() signUpDto: SignUpDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(file);
    const user = await this.authService.signUp(
      signUpDto.email,
      signUpDto.password,
      signUpDto.name,
      file, // Use the uploaded file for the image
    );
    return { message: 'successful signup', user };
  }

  @UseGuards(LocalStrategy)
  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    const token = await this.authService.signIn(
      signInDto.email,
      signInDto.password,
    );
    return { token };
  }
}
