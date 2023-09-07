// auth.controller.ts

import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  // ConflictException,
  // NotFoundException,
  Patch,
  Req,
  // BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from 'src/auth/signup.dto';
import { SignInDto } from './signin.dto';
import { LocalStrategy } from './strategies/local.strategy';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ResetPasswordDto } from './password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// import { User } from './user.schema';
import { UserModel } from './user.model';
// import * as bcrypt from 'bcrypt';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cloudinaryService: CloudinaryService, // Inject CloudinaryService
    private readonly userService: UserModel,
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

  @Post('request-password-reset')
  async requestPasswordReset(@Body() body: { email: string }) {
    await this.authService.requestPasswordReset(body.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    // if (
    //   !resetPasswordDto.email ||
    //   !resetPasswordDto.otp ||
    //   !resetPasswordDto.newPassword
    // ) {
    //   throw new BadRequestException('Invalid request body');
    // }

    try {
      await this.authService.resetPassword(resetPasswordDto);
      return { message: 'Password reset successful' };
    } catch (error) {
      // Handle errors and return appropriate responses
      throw error;
    }
  }
  @Patch('update')
  @UseGuards(AuthGuard('jwt')) // Use JWT guard for authentication
  @UseInterceptors(FileInterceptor('file')) // Use the FileInterceptor to handle file uploads
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File, // Accept the uploaded file as an argument
    @Req() req: any,
  ) {
    try {
      const userId = req.user._id; // Get the user ID from the attached user object in the request

      // Update the user information
      const updatedUser = await this.authService.updateUser(
        userId,
        updateUserDto,
        file,
      );

      return {
        message: 'User information updated successfully',
        user: updatedUser,
      };
    } catch (error) {
      throw error; // Handle errors appropriately (e.g., return a meaningful error response)
    }
  }
}
