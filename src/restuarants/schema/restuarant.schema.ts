/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export enum Category {
  FAST_FOOD = 'FAST FOOD',
  CAFE = 'Cafe',
}
@Schema()
export class Restuarant {
  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop()
  email: string;

  @Prop()
  images?: object[];
  @Prop()
  category: Category;
}
export const restuarantsSchema = SchemaFactory.createForClass(Restuarant);
