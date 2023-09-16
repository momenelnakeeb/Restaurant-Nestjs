/* eslint-disable prettier/prettier */
// admin.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { User } from '../user.schema';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const user: User = context.switchToHttp().getRequest().user;

    if (user && user.role === 'admin') {
      return true; // User is an admin, allow access
    }

    // If the user is not an admin, throw a ForbiddenException with a custom message
    throw new ForbiddenException(
      'You do not have permission to access this resource.',
    );
  }
}
