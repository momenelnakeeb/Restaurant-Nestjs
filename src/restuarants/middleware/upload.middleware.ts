/* eslint-disable prettier/prettier */
// cloudinary.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { cloudinary } from 'util/cloudinary.config';


@Injectable()
export class CloudinaryMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    if (req.file) {
      try {
        // Upload the image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'images', // Set the desired folder in Cloudinary
        });

        // Update the DTO with the Cloudinary image URL
        req.body.images = result.secure_url;
      } catch (error) {
        // Handle any errors here
        console.error('Error uploading image to Cloudinary:', error);
      }
    }

    next();
  }
}
