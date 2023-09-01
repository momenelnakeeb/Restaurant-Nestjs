import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  ValidationPipe,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { RestuarantsService } from './restuarants.service';
import {
  CreateRestuarantDto,
  UpdateRestuarantDto,
} from './dto/create-restuarant.dto';

@Controller('restuarants')
export class RestuarantsController {
  constructor(private readonly restuarantsService: RestuarantsService) {}

  // Create a new restaurant
  @Post()
  async createRestuarant(
    @Body(new ValidationPipe()) createRestuarantDto: CreateRestuarantDto,
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const restaurant =
        await this.restuarantsService.createRestuarant(createRestuarantDto);
      return {
        success: true,
        message: 'Restaurant created successfully',
        data: restaurant,
      };
    } catch (error) {
      return { success: false, message: 'Failed to create restaurant' };
    }
  }

  // Get all restaurants, optionally filtered by name
  @Get()
  async findAllRestuarants(
    @Query('name') name: string,
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const restaurants =
        await this.restuarantsService.findAllRestuarants(name);
      return {
        success: true,
        message: 'Restaurants fetched successfully',
        data: restaurants,
      };
    } catch (error) {
      return { success: false, message: 'Failed to fetch restaurants' };
    }
  }

  // Search for restaurants by name
  @Get('search')
  async searchRestuarantsByName(
    @Query('name') name: string,
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const restaurants =
        await this.restuarantsService.searchRestuarantsByName(name);
      return {
        success: true,
        message: 'Restaurants found successfully',
        data: restaurants,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to find restaurants by name',
      };
    }
  }

  // Get a restaurant by ID
  @Get(':id')
  async findRestuarantById(
    @Param('id') id: string,
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const restaurant = await this.restuarantsService.findRestuarantById(id);
      if (restaurant) {
        return { success: true, message: 'Restaurant found', data: restaurant };
      } else {
        return { success: false, message: 'Restaurant not found' };
      }
    } catch (error) {
      return { success: false, message: 'Failed to fetch restaurant' };
    }
  }

  // Update a restaurant by ID
  @Put(':id')
  async updateRestuarant(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateRestuarantDto: UpdateRestuarantDto,
  ): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const restaurant = await this.restuarantsService.updateRestuarant(
        id,
        updateRestuarantDto,
      );
      return {
        success: true,
        message: 'Restaurant updated successfully',
        data: restaurant,
      };
    } catch (error) {
      return { success: false, message: 'Failed to update restaurant' };
    }
  }

  // Delete a restaurant by ID
  @Delete(':id')
  async deleteRestuarant(
    @Param('id') id: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.restuarantsService.deleteRestuarant(id);
      return { success: true, message: 'Restaurant deleted successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to delete restaurant' };
    }
  }
}
