/* eslint-disable prettier/prettier */
// user.model.ts

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/auth/user.schema';

@Injectable()
export class UserModel {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  async createUser(
    email: string,
    password: string,
    name: string,
    image?: string,
  ): Promise<User> {
    const user = new this.userModel({ email, password, name, image });
    return user.save();
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }
}
