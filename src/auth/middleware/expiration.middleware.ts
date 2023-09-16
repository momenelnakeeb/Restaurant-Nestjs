/* eslint-disable prettier/prettier */
// expiration.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenExpirationMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // Check if the user is authenticated (i.e., JWT token is present)
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      try {
        // Verify the token and get its payload
        const payload = this.jwtService.verify(token);
        req.user = payload; // Attach the payload to the request

        // Check if the token has expired
        if (Date.now() >= payload.exp * 1000) {
          // Token has expired, log the user out
          return res.status(401).json({ message: 'Token has expired' });
        }
      } catch (error) {
        // Token is invalid, log the user out
        return res.status(401).json({ message: 'Invalid token' });
      }
    }

    // Continue processing the request
    next();
  }
}
