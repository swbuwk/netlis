import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { ROLES_KEY } from '../roles/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector,
            private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
        const req = context.switchToHttp().getRequest();
        const authHeader = req.headers.authorization
        console.log(req.headers)
        const token = authHeader.split(" ")[1]


        let user
        
        try {
          user = this.jwtService.verify(token)
        } catch {
          return false
        }



        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
          ]);
          if (!requiredRoles) {
            return true;
          }

          req.user = user
          return user.roles.some((role) => requiredRoles.includes(role.name));
    } catch (error) {
      console.log(error)
        throw new HttpException("Don't have permisiion to this endpoint", HttpStatus.UNAUTHORIZED)
    }
  }
}