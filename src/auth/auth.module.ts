// auth.module.ts

import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/auth/user.schema';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModel } from './user.model';
import { AuthController } from './auth.controller';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { EmailService } from './Email.service';
import { TokenExpirationMiddleware } from './middleware/expiration.middleware';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1d' },
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    UserModel,
    CloudinaryService,
    EmailService,
  ],

  controllers: [AuthController],
  exports: [AuthService, MongooseModule, UserModel],
})
export class AuthModule {
  // AppModule constructor and configuration
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenExpirationMiddleware).forRoutes('*');
  }
}
