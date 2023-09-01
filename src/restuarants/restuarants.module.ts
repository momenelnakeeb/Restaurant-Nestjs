import { Module } from '@nestjs/common';
import { RestuarantsController } from './restuarants.controller';
import { RestuarantsService } from './restuarants.service';
import { Restuarant, restuarantsSchema } from './schema/restuarant.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Restuarant.name, schema: restuarantsSchema },
    ]),
  ],
  providers: [RestuarantsService],
  controllers: [RestuarantsController],
})
export class RestuarantsModule {}
