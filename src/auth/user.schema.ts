/* eslint-disable prettier/prettier */
// user.schema.ts

// import { Exclude } from 'class-transformer';
import { Schema, Document } from 'mongoose';

export interface PasswordResetOTP {
  otp: string;
  expiresAt: Date;
}

export interface User extends Document {
  email: string;

  password: string;

  name: string;
  file?: string;
  passwordResetOTP?: PasswordResetOTP; // Declare the passwordResetOTP property
}

export const UserSchema = new Schema<User>(
  {
    email: { type: String, unique: true },
    password: String,
    name: String,
    file: String,
    passwordResetOTP: {
      otp: String,
      expiresAt: Date,
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        // Exclude the password field from the response
        delete ret.password;
      },
    },
  },
);
