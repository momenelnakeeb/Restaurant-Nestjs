import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Restuarant } from './schema/restuarant.schema';
import { CreateRestuarantDto } from './dto/create-restuarant.dto';
import { UpdateRestuarantDto } from './dto/update-restuarant.dto';

@Injectable()
export class RestuarantsService {
  constructor(
    @InjectModel(Restuarant.name)
    private restuarantModel: mongoose.Model<Restuarant>,
  ) {}
  async createRestuarant(
    createRestuarantDto: CreateRestuarantDto,
  ): Promise<Restuarant> {
    const restuarant = new this.restuarantModel(createRestuarantDto);
    return restuarant.save();
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
  async updateRestuarant(
    id: string,
    updateRestuarantDto: UpdateRestuarantDto,
  ): Promise<Restuarant> {
    const restuarant = await this.restuarantModel.findByIdAndUpdate(
      id,
      updateRestuarantDto,
      {
        new: true,
      },
    );

    if (!restuarant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }

    return restuarant;
  }

  async deleteRestuarant(id: string): Promise<void> {
    const deletedRestuarant = await this.restuarantModel.findByIdAndDelete(id);

    if (!deletedRestuarant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`);
    }
  }
}
