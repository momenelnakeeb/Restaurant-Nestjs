import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
// import { User } from 'src/auth/user.schema';

@Schema()
export class Meal extends Document {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop() // Make the imageUrl field optional
  image?: string; // Note the '?' after string to make it optional

  @Prop({ type: 'ObjectId', ref: 'Restaurant' })
  restaurant: string; // Reference to the Restaurant

  @Prop({ type: 'ObjectId', ref: 'User' }) // Reference to the User who created the meal
  createdBy: string; // Change the type to string to store the user's _id
  @Prop({ type: 'Mixed' }) // Use 'Mixed' type to store arbitrary user data
  createdByUser: Record<string, any>; // Field to store user information
}

export const MealSchema = SchemaFactory.createForClass(Meal);
