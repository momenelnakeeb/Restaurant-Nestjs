import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Restuarant } from './schema/restuarant.schema';
import { CreateRestuarantDto } from './dto/create-restuarant.dto';
import { UpdateRestuarantDto } from './dto/update-restuarant.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Injectable()
export class RestuarantsService {
  constructor(
    @InjectModel(Restuarant.name)
    private restuarantModel: mongoose.Model<Restuarant>,
    private cloudinaryService: CloudinaryService,
  ) {}
  async createRestuarant(
    createRestuarantDto: CreateRestuarantDto,
    @CurrentUser() user: any,
  ): Promise<Restuarant> {
    const restuarant = new this.restuarantModel({
      ...createRestuarantDto,
      createdBy: user._id,
    });

    if (createRestuarantDto.file) {
      const cloudinaryResponse = await this.cloudinaryService.uploadImage(
        createRestuarantDto.file,
      );
      restuarant.file = cloudinaryResponse.url;
    }

    // Log user and user role
    console.log('User in RestuarantsService:', user);
    console.log('User Role in RestuarantsService:', user?.role);

    return restuarant.save();
  }

  async updateRestuarant(
    id: string,
    updateRestuarantDto: UpdateRestuarantDto,
    @CurrentUser() user: any,
  ): Promise<Restuarant> {
    const existingRestaurant = await this.findRestuarantById(id);

    if (!existingRestaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }

    // Ensure that only the user who created the restaurant can update it
    if (existingRestaurant.createdBy !== user._id) {
      throw new ForbiddenException(
        'You do not have permission to update this restaurant',
      );
    }

    if (updateRestuarantDto.file) {
      const cloudinaryResponse = await this.cloudinaryService.uploadImage(
        updateRestuarantDto.file,
      );
      existingRestaurant.file = cloudinaryResponse.url;
    }

    // Log user and user role
    console.log('User in updateRestuarant:', user);
    console.log('User Role in updateRestuarant:', user?.role);

    // Update the restaurant's other fields
    Object.assign(existingRestaurant, updateRestuarantDto);

    return existingRestaurant.save();
  }

  async findAllRestuarants(name: string): Promise<Restuarant[]> {
    // Modify the function to accept an optional name parameter
    if (name) {
      // If name is provided, perform a search by name
      return this.restuarantModel
        .find({ name: { $regex: new RegExp(name, 'i') } })
        .exec();
    } else {
      // If name is not provided, return all restaurants
      return this.restuarantModel.find().exec();
    }
  }
  // Add a new method for searching restaurants by name
  async searchRestuarantsByName(name: string): Promise<Restuarant[]> {
    return this.restuarantModel
      .find({ name: { $regex: new RegExp(name, 'i') } })
      .exec();
  }

  async findRestuarantById(id: string): Promise<Restuarant> {
    return this.restuarantModel.findById(id).exec();
  }

  // Add more methods as needed

  async deleteRestuarant(id: string): Promise<void> {
    const deletedRestuarant = await this.restuarantModel.findByIdAndDelete(id);

    if (!deletedRestuarant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }
  }
}
