import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  // ValidationPipe,
  Delete,
  // Put,
  Query,
  UseInterceptors,
  UploadedFile,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RestuarantsService } from './restuarants.service';
import {
  CreateRestuarantDto,
  UpdateRestuarantDto,
} from './dto/create-restuarant.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { v2 as cloudinary } from 'cloudinary';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { User } from 'src/auth/user.schema';

// Configure Cloudinary with your account details
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

@Controller('restuarants')
export class RestuarantsController {
  // CloudinaryService: any;
  // cloudinary: any;
  constructor(
    private readonly restuarantsService: RestuarantsService,
    private readonly CloudinaryService: CloudinaryService,
  ) {}

  // @Post(':id/upload-image')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadfile(
  //   @Param('id') id: string, // Restaurant ID from the URL
  //   @UploadedFile() file: Express.Multer.File,
  // ) {
  //   // Check if the restaurant exists
  //   const restaurant = await this.restuarantsService.findRestuarantById(id);

  //   if (!restaurant) {
  //     // Handle the case where the restaurant does not exist
  //     // You can throw an exception or return an error response here
  //   }

  //   // Upload the image to Cloudinary and get the secure URL
  //   const cloudinaryResponse = await this.CloudinaryService.uploadImage(file);

  //   // Add the secure URL to the restaurant's images array or update its image URL
  //   restaurant.images.push(cloudinaryResponse.url);

  //   // Save the updated restaurant
  //   await this.restuarantsService.updateRestuarant(id, restaurant);

  //   // Return a success response
  //   return {
  //     message: 'Image uploaded successfully',
  //     imageURL: cloudinaryResponse.url,
  //     images: restaurant.images,
  //   };
  // }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AdminGuard)
  async createRestaurant(
    @Body() createRestaurantDto: CreateRestuarantDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    try {
      createRestaurantDto.images = [];
      if (file) {
        const cloudinaryResponse =
          await this.CloudinaryService.uploadImage(file);
        createRestaurantDto.images.push(cloudinaryResponse.url);
      }

      // Log user and user role
      console.log('User:', user);
      console.log('User Role:', user?.role);

      const restaurant = await this.restuarantsService.createRestuarant(
        createRestaurantDto,
        user,
      );

      return {
        success: true,
        message: 'Restaurant created successfully',
        data: {
          restaurant,
          user,
        },
      };
    } catch (error) {
      console.log(error.message);
      return {
        success: false,
        message: 'Failed to create restaurant',
      };
    }
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AdminGuard)
  async updateRestuarant(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestuarantDto,
    @UploadedFile() file: Express.Multer.File, // Use @UploadedFile() decorator
    @CurrentUser() user: User, // Inject the current user using the CurrentUser decorator
  ) {
    try {
      updateRestaurantDto.images = [];
      if (file) {
        const cloudinaryResponse =
          await this.CloudinaryService.uploadImage(file);
        updateRestaurantDto.images.push(cloudinaryResponse.url);
      }

      // Log user and user role
      console.log('User:', user);
      console.log('User Role:', user?.role);

      const restaurant = await this.restuarantsService.createRestuarant(
        updateRestaurantDto,
        user,
      );

      return {
        success: true,
        message: 'Restaurant created successfully',
        data: {
          restaurant,
          user,
        },
      };
    } catch (error) {
      console.log(error.message);
      return {
        success: false,
        message: 'Failed to create restaurant',
      };
    }
  }

  @Post('upload-image')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.CloudinaryService.uploadImage(file);
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
