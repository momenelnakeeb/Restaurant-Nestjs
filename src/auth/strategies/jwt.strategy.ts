/* eslint-disable prettier/prettier */
// jwt.strategy.ts
// jwt.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { UserModel } from '../user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserModel,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your-secret-key',
    });
  }

  async validateByEmail(payload: any) {
    const user = await this.userService.findUserByEmail(payload.email);
    if (!user) {
      return null;
    }
    return user;
  }
  async validate(payload: any, req: any) {
    const user = await this.userService.findUserById(payload.sub);
    if (!user) {
      return null;
    }
    req.user = user; // Attach the user object to the request
    return user;
  }
}
