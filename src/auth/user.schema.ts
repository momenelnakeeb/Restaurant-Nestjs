/* eslint-disable prettier/prettier */
// user.schema.ts

// import { Exclude } from 'class-transformer';
import { Schema, Document } from 'mongoose';
import { Exclude, Expose, Transform } from 'class-transformer';

// user.schema.ts

export class UserClass {
  @Expose() // Include the 'email' property in serialization
  email: string;

  @Exclude() // Exclude the 'password' property from serialization
  password: string;

  @Expose() // Include the 'name' property in serialization
  name: string;

  @Expose({ name: 'file' }) // Include the 'file' property in serialization with a different name
  file?: string;

  @Expose({ toPlainOnly: true })
  @Transform((value) => value.toString(), { toPlainOnly: true })
  _id: string;
}

export interface PasswordResetOTP {
  otp: string;
  expiresAt: Date;
}

export interface User extends Document {
  _id: string; // Define _id as a string to represent the id property
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
        // Exclude the __v property from the response
        delete ret.__v;
      },
    },
  },
  // {
  //   toJSON: {
  //     transform: function (doc, ret) {
  //       // Exclude the password field from the response
  //       delete ret.password;
  //     },
  //   },
  // },
);
