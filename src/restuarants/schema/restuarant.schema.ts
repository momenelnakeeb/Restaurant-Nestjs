/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export enum Category {
  FAST_FOOD = 'FAST FOOD',
  CAFE = 'Cafe',
}
// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose'; // Import Document type

@Schema()
export class Restuarant extends Document {
  // Extend Document
  @Prop()
  name: string;

  // @Prop()
  // age: number;

  @Prop()
  email: string;

  @Prop()
  images?: object[];

  @Prop()
  file?: string;

  @Prop()
  category: Category;

  @Prop({ type: 'ObjectId', ref: 'User' })
  createdBy: string;

  @Prop({ type: [{ type: 'ObjectId', ref: 'Meal' }] })
  menu: string[]; // Array of meal IDs
}

export const restuarantsSchema = SchemaFactory.createForClass(Restuarant);
