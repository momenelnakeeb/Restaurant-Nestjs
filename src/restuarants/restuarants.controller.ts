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

  @Post(':id/upload-image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadfile(
    @Param('id') id: string, // Restaurant ID from the URL
    @UploadedFile() file: Express.Multer.File,
  ) {
    // Check if the restaurant exists
    const restaurant = await this.restuarantsService.findRestuarantById(id);

    if (!restaurant) {
      // Handle the case where the restaurant does not exist
      // You can throw an exception or return an error response here
    }

    // Upload the image to Cloudinary and get the secure URL
    const cloudinaryResponse = await this.CloudinaryService.uploadImage(file);

    // Add the secure URL to the restaurant's images array or update its image URL
    restaurant.images.push(cloudinaryResponse.url);

    // Save the updated restaurant
    await this.restuarantsService.updateRestuarant(id, restaurant);

    // Return a success response
    return {
      message: 'Image uploaded successfully',
      imageURL: cloudinaryResponse.url,
      images: restaurant.images,
    };
  }

  // Create a restaurant
  // Create a restaurant with an optional image upload to Cloudinary
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createRestaurant(
    @Body() createRestaurantDto: CreateRestuarantDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      createRestaurantDto.images = [];
      if (file) {
        const cloudinaryResponse =
          await this.CloudinaryService.uploadImage(file);
        console.log(file);
        // createRestaurantDto.file = cloudinaryResponse.url;
        createRestaurantDto.images.push(cloudinaryResponse.url);
      }

      const restaurant =
        await this.restuarantsService.createRestuarant(createRestaurantDto);

      return {
        success: true,
        message: 'Restaurant created successfully',
        data: {
          restaurant,
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

  // // Update a restaurant by ID
  // @Put(':id')
  // async updateRestuarant(
  //   @Param('id') id: string,
  //   @Body() updateRestaurantDto: UpdateRestuarantDto,
  // ) {
  //   // Check if an image is provided in updateRestaurantDto and handle it accordingly
  //   if (updateRestaurantDto.file) {
  //     // Handle image upload and get the image URL
  //     const imageUrl = await this.CloudinaryService.uploadImage(
  //       updateRestaurantDto.file,
  //     );
  //     // Set the image URL in the DTO
  //     updateRestaurantDto.file = imageUrl.url;
  //   }

  //   // Call the service method to update the restaurant with the updated DTO
  //   return this.restuarantsService.updateRestuarant(id, updateRestaurantDto);
  // }

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
