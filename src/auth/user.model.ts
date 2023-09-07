/* eslint-disable prettier/prettier */
// user.model.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UserModel {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async createUser(
    email: string,
    password: string,
    name: string,
    file?: string,
  ): Promise<User> {
    const user = new this.userModel({ email, password, name, file });
    return user.save();
  }

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      console.log('Searching for email:', email);
      const user = await this.userModel.findOne({ email }).exec();
      console.log('Found user:', user);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  }

  async findUserByName(name: string): Promise<User | null> {
    return this.userModel.findOne({ name }).exec();
  }

  async updateUser(user: User): Promise<User> {
    return user.save();
  }
}
