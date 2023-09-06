import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserModel } from './user.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserModel,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(
    email: string,
    password: string,
    name: string,
    image?: string,
  ): Promise<{ message: string; user: any }> {
    // Check if the email already exists
    const existingUser = await this.userService.findUserByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await this.userService.createUser(
      email,
      hashedPassword,
      name,
      image,
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
