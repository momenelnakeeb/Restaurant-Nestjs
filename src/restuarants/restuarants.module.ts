import { Module } from '@nestjs/common';
import { RestuarantsController } from './restuarants.controller';
import { RestuarantsService } from './restuarants.service';
import { Restuarant, restuarantsSchema } from './schema/restuarant.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Restuarant.name, schema: restuarantsSchema },
    ]),
    CloudinaryModule,
  ],
  providers: [RestuarantsService],
  controllers: [RestuarantsController],
  exports: [MongooseModule],
})
export class RestuarantsModule {}
