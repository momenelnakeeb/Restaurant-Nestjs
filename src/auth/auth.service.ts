import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from './user.model';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import * as bcrypt from 'bcrypt';
// import { randomBytes } from 'crypto'; // Import the randomBytes function
import { EmailService } from './Email.service';
import { ResetPasswordDto } from './password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserClass } from './user.schema';
// import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserModel,
    private readonly jwtService: JwtService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly emailService: EmailService, // Inject the EmailService
  ) {}

  async signUp(
    email: string,
    password: string,
    name: string,
    file?: Express.Multer.File, // Accept an optional file for image upload
    role?: string,
  ): Promise<{ message: string; user: any }> {
    try {
      // Check if the email already exists
      const existingUser = await this.userService.findUserByEmail(email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      // Check if the name already exists
      const existingName = await this.userService.findUserByName(name);
      if (existingName) {
        throw new ConflictException('Name already exists');
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Upload the image to Cloudinary if a file is provided
      let imageUrl: string | undefined;
      if (file) {
        const cloudinaryResponse =
          await this.cloudinaryService.uploadImage(file);
        imageUrl = cloudinaryResponse.url;
      }

      // Create the user with the image URL if it exists
      const newUser = await this.userService.createUser(
        email,
        hashedPassword,
        name,
        imageUrl, // Use the uploaded image URL if available
        role,
      );

      // Remove the password from the user object
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      // const { password: _, ...userWithoutPassword } = newUser.toObject();

      return { message: 'message', user: newUser };
    } catch (error) {
      throw error; // Rethrow any exceptions
    }
  }

  async signIn(email: string, password: string): Promise<string> {
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, _id: user.id, role: user.role };
    return this.jwtService.sign(payload);
  }

  async validateUser(email: string, password: string): Promise<any> {
    try {
      // Find the user by email in your database
      const user = await this.userService.findUserByEmail(email);

      if (!user) {
        return null; // User not found
      }

      // Compare the provided password with the hashed password in the user object
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        // If the password is valid, return the user
        return user;
      }

      return null; // Password is invalid
    } catch (error) {
      throw error; // Rethrow any exceptions
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    try {
      const user = await this.userService.findUserByEmail(email);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const otp = this.generateOTP();
      const otpExpiration = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

      user.passwordResetOTP = {
        otp,
        expiresAt: otpExpiration,
      };

      await this.userService.updateUser(user);

      const emailSubject = 'Password Reset OTP';
      const emailText = `Your OTP for password reset: ${otp}`;

      await this.emailService.sendEmail(email, emailSubject, emailText);
    } catch (error) {
      // Handle any errors that occur during the process
      throw error;
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    try {
      // Find the user by email
      const user = await this.userService.findUserByEmail(
        resetPasswordDto.email,
      );

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Check if the user has a valid OTP for password reset
      if (
        !user.passwordResetOTP ||
        user.passwordResetOTP.expiresAt < new Date()
      ) {
        throw new UnauthorizedException('Invalid or expired OTP');
      }

      // Verify if the provided OTP matches the stored OTP
      if (resetPasswordDto.otp !== user.passwordResetOTP.otp) {
        throw new UnauthorizedException('Invalid OTP');
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(
        resetPasswordDto.newPassword,
        10,
      );

      // Update the user's password
      user.password = hashedPassword;

      // Clear the passwordResetOTP
      user.passwordResetOTP = undefined;

      // Save the updated user
      await this.userService.updateUser(user);

      // Optionally, you can send a success email or notification here
    } catch (error) {
      // Handle any errors that occur during the process
      throw error;
    }
  }
  private generateOTP(): string {
    // Generate a 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
    file?: Express.Multer.File,
  ): Promise<UserClass> {
    try {
      // Find the user by ID
      const user = await this.userService.findUserById(userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // // Clone the original user object
      // const originalUser = { ...user.toObject() };

      if (
        updateUserDto.email !== undefined &&
        updateUserDto.email !== user.email
      ) {
        const existingEmailUser = await this.userService.findUserByEmail(
          updateUserDto.email,
        );
        if (existingEmailUser && updateUserDto.name !== user.name) {
          throw new ConflictException('Email already exists');
        }

        // Update the user's email
        user.email = updateUserDto.email;
      }

      if (
        updateUserDto.name !== undefined &&
        updateUserDto.name !== user.name
      ) {
        const existingNameUser = await this.userService.findUserByName(
          updateUserDto.name,
        );
        if (existingNameUser) {
          throw new ConflictException('Name already exists');
        }

        // Update the user's name
        user.name = updateUserDto.name;
      }

      // If a file is provided, update the user's file (e.g., profile picture)
      if (file) {
        // Upload the new image to Cloudinary
        const cloudinaryResponse =
          await this.cloudinaryService.uploadImage(file);
        user.file = cloudinaryResponse.url; // Update the user's file URL
      }

      // If a new password is provided, update it
      if (updateUserDto.newPassword) {
        const hashedPassword = await bcrypt.hash(updateUserDto.newPassword, 10);
        user.password = hashedPassword;
      }

      // Save the updated user
      const updatedUser = await this.userService.updateUser(user);

      return updatedUser; // Return the updated UserClass
    } catch (error) {
      throw error; // Handle errors appropriately (e.g., log, return a meaningful error)
    }
  }
}
