// meal.controller.ts
import {
  Controller,
  Post,
  Put,
  Get,
  Delete,
  Param,
  Body,
  NotFoundException,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  // Req,
} from '@nestjs/common';
import { MealService } from './meal.service';
import { CreateMealDto, UpdateMealDto } from '../meal/dto/meal.dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/auth/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('meals')
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @Post()
  @UseGuards(AdminGuard) // Apply AdminGuard to this endpoint
  @UseInterceptors(FileInterceptor('image')) // Use FileInterceptor to handle image upload
  async create(
    @Body() createMealDto: CreateMealDto,
    @CurrentUser() user: User,
    @UploadedFile() image?: Express.Multer.File, // Make the image parameter optional
  ) {
    try {
      const mealAndUserAndRestaurant = await this.mealService.createMeal(
        { ...createMealDto, image }, // Pass the image as part of createMealDto
        user,
      );
      return {
        success: true,
        message: 'Meal created successfully',
        data: mealAndUserAndRestaurant,
      };
    } catch (error) {
      // Handle exceptions here, e.g., log the error or throw a custom exception
      throw new NotFoundException({ success: false, message: error.message });
    }
  }

  @Put(':id')
  @UseGuards(AdminGuard) // Apply AdminGuard to this endpoint
  @UseInterceptors(FileInterceptor('image')) // Use FileInterceptor to handle image upload
  async update(
    @Param('id') id: string,
    @Body() updateMealDto: UpdateMealDto,
    @CurrentUser() user: User,
    @UploadedFile() image?: Express.Multer.File, // Make the image parameter optional
  ) {
    try {
      const mealAndUserAndRestaurant = await this.mealService.updateMeal(
        id,
        { ...updateMealDto, image }, // Pass the image as part of updateMealDto
        user,
        image, // Pass the image file to the service
      );
      return {
        success: true,
        message: 'Meal updated successfully',
        data: mealAndUserAndRestaurant,
      };
    } catch (error) {
      // Handle exceptions here, e.g., log the error or throw a custom exception
      throw new NotFoundException({ success: false, message: error.message });
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const meal = await this.mealService.getMeal(id);
      return { success: true, data: meal };
    } catch (error) {
      throw new NotFoundException({ success: false, message: error.message });
    }
  }

  @Get()
  async getAll() {
    try {
      const meals = await this.mealService.getAllMeals();
      return { success: true, data: meals };
    } catch (error) {
      throw new NotFoundException({ success: false, message: error.message });
    }
  }

  @Delete(':id')
  @UseGuards(AdminGuard) // Apply AdminGuard to this endpoint
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    try {
      await this.mealService.deleteMeal(id, user);
      return { success: true, message: 'Meal deleted successfully' };
    } catch (error) {
      throw new NotFoundException({ success: false, message: error.message });
    }
  }
}
