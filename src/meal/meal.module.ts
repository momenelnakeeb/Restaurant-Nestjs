import { Module } from '@nestjs/common';
import { MealService } from './meal.service';
import { MealController } from './meal.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Meal, MealSchema } from './schema/meal.schema';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { RestuarantsModule } from 'src/restuarants/restuarants.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModel } from 'src/auth/user.model';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: Meal.name, schema: MealSchema }]),
    RestuarantsModule,
    CloudinaryModule,
  ],
  providers: [MealService, AdminGuard, UserModel],
  controllers: [MealController],
})
export class MealModule {}
