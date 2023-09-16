import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UploadedFile,
} from '@nestjs/common';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateMealDto, UpdateMealDto } from './dto/meal.dto';
import { Meal } from './schema/meal.schema';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/auth/user.schema';
import { Restuarant } from 'src/restuarants/schema/restuarant.schema';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
// import { UserModel } from 'src/auth/user.model';

@Injectable()
export class MealService {
  constructor(
    @InjectModel(Meal.name) private mealModel: mongoose.Model<Meal>,
    @InjectModel(Restuarant.name)
    private restaurantModel: mongoose.Model<Restuarant>, // Inject Restaurant model
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createMeal(
    createMealDto: CreateMealDto,
    @CurrentUser() user: User,
  ): Promise<{ meal: Meal; user: User; restaurant: Restuarant }> {
    try {
      // Check if the user is an admin
      if (!user || user.role !== 'admin') {
        throw new ForbiddenException('Only admins can create meals.');
      }

      // Assign the user's _id directly as a string
      const meal = new this.mealModel({
        ...createMealDto,
        createdBy: user?._id || null,
        restaurant: createMealDto.restaurantId,
        image: createMealDto.image,
        // createdByUser: user,
      });
      if (createMealDto.image) {
        const cloudinaryResponse = await this.cloudinaryService.uploadImage(
          createMealDto.image,
        );
        meal.image = cloudinaryResponse.url;
      }
      await meal.save();

      // Add the meal to the restaurant's menu
      const restaurant = await this.restaurantModel.findById(
        createMealDto.restaurantId,
      );
      if (!restaurant) {
        throw new NotFoundException('Restaurant not found');
      }
      restaurant.menu.push(meal._id);
      await restaurant.save();

      return { meal, user, restaurant };
    } catch (error) {
      // Handle exceptions here, e.g., log the error or throw a custom exception
      throw error;
    }
  }
  async updateMeal(
    id: string,
    updateMealDto: UpdateMealDto,
    user: User,
    image?: Express.Multer.File, // Make the image parameter optional
  ): Promise<{ meal: Meal; user: User; restaurant: Restuarant } | null> {
    try {
      // Check if the user is an admin
      if (user.role !== 'admin') {
        throw new ForbiddenException('Only admins can update meals.');
      }

      const meal = await this.mealModel.findById(id);
      if (!meal) {
        throw new NotFoundException('Meal not found to update');
      }

      // If image is provided, update the meal's image
      if (image) {
        const cloudinaryResponse =
          await this.cloudinaryService.uploadImage(image);
        updateMealDto.image = cloudinaryResponse.url;
      }

      // Update the meal's properties
      meal.set({
        ...updateMealDto,
        restaurant: updateMealDto.restaurantId,
        image: updateMealDto.image,
      });

      // Save the updated meal
      await meal.save();

      // If the restaurantId has changed, update the restaurant information
      let restaurant: Restuarant | undefined;
      if (
        updateMealDto.restaurantId &&
        updateMealDto.restaurantId !== meal.restaurant.toString()
      ) {
        restaurant = await this.restaurantModel.findById(
          updateMealDto.restaurantId,
        );
        if (!restaurant) {
          throw new NotFoundException('Restaurant not found');
        }
        // Remove the meal from the old restaurant's menu and add it to the new one
        const oldRestaurant = await this.restaurantModel.findById(
          meal.restaurant,
        );
        if (oldRestaurant) {
          oldRestaurant.menu = oldRestaurant.menu.filter(
            (menuId) => menuId.toString() !== meal._id.toString(),
          );
          await oldRestaurant.save();
        }
        restaurant.menu.push(meal._id);
        await restaurant.save();
      }

      return { meal, user, restaurant };
    } catch (error) {
      // Handle exceptions here, e.g., log the error or throw a custom exception
      throw error;
    }
  }
  // async updateMeal(
  //   id: string,
  //   updateMealDto: UpdateMealDto,
  //   @CurrentUser() user: User,
  //   @UploadedFile() image?: Express.Multer.File, // Make the image parameter optional
  // ): Promise<{ meal: Meal; user: User; restaurant: Restuarant } | null> {
  //   try {
  //     // Check if the user is an admin
  //     if (user.role !== 'admin') {
  //       throw new ForbiddenException('Only admins can update meals.');
  //     }

  //     const meal = await this.mealModel.findByIdAndUpdate(id, updateMealDto, {
  //       new: true,
  //     });
  //     if (!meal) {
  //       throw new NotFoundException('Meal not found to update');
  //     }

  //     // Update the restaurant information if restaurantId is provided in the DTO
  //     let restaurant: Restuarant | undefined;
  //     if (updateMealDto.restaurantId) {
  //       restaurant = await this.restaurantModel.findByIdAndUpdate(
  //         updateMealDto.restaurantId,
  //         { $set: updateMealDto },
  //         { new: true },
  //       );
  //       if (!restaurant) {
  //         throw new NotFoundException('Restaurant not found');
  //       }
  //     }

  //     // Upload the image if provided
  //     if (image) {
  //       const cloudinaryResponse =
  //         await this.cloudinaryService.uploadImage(image);
  //       meal.image = cloudinaryResponse.url;
  //       await meal.save();
  //     }

  //     return { meal, user, restaurant };
  //   } catch (error) {
  //     // Handle exceptions here, e.g., log the error or throw a custom exception
  //     throw error;
  //   }
  // }

  async getMeal(id: string): Promise<Meal | null> {
    const meal = await this.mealModel
      .findById(id)
      .populate('createdBy', 'name'); // Populate the createdBy field
    if (!meal) {
      throw new NotFoundException('Meal not found to get');
    }
    return meal;
  }

  async getAllMeals(): Promise<Meal[]> {
    const meals = await this.mealModel.find().populate('createdBy', 'name');
    return meals;
  }

  async deleteMeal(id: string, @CurrentUser() user: User): Promise<void> {
    // Check if the user is an admin
    if (user.role !== 'admin') {
      throw new ForbiddenException('Only admins can delete meals.');
    }

    const meal = await this.mealModel.findById(id);
    if (!meal) {
      throw new NotFoundException('Meal not found to delete');
    }
    await this.mealModel.findByIdAndDelete(id);
  }
}
