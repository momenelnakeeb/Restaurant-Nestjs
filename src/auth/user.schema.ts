/* eslint-disable prettier/prettier */
// user.schema.ts

import { Schema, Document } from 'mongoose';

export interface User extends Document {
  email: string;
  password: string;
  name: string;
  file?: string;
}

export const UserSchema = new Schema<User>({
  email: { type: String, unique: true },
  password: String,
  name: String,
  file: String,
});
