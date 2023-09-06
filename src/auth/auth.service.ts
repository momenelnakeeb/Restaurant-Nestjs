import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserModel } from './user.model';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserModel,
    private readonly jwtService: JwtService,
    private readonly cloudinaryService: CloudinaryService, // Inject CloudinaryService
  ) {}

  async signUp(
    email: string,
    password: string,
    name: string,
    file?: Express.Multer.File, // Accept an optional file for image upload
  ): Promise<{ message: string; user: any }> {
    // Check if the email already exists
    const existingUser = await this.userService.findUserByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload the image to Cloudinary if a file is provided
    let imageUrl: string | undefined;
    if (file) {
      const cloudinaryResponse = await this.cloudinaryService.uploadImage(file);
      imageUrl = cloudinaryResponse.url;
    }

    // Create the user with the image URL if it exists
    const newUser = await this.userService.createUser(
      email,
      hashedPassword,
      name,
      imageUrl, // Use the uploaded image URL if available
    );

    // Remove the password from the user object
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userWithoutPassword } = newUser.toObject();

    return userWithoutPassword;
  }

  async signIn(email: string, password: string): Promise<string> {
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }

  async validateUser(email: string, password: string): Promise<any> {
    // Find the user by email in your database (you may use your UserModel)
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
  }
}
