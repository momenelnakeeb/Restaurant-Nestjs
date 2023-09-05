/* eslint-disable prettier/prettier */
// cloudinary-response.ts
import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;
