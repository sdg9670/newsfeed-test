import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';
import { Request } from 'express';
import { ROLE } from '../models/role.model';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles || roles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    const adminCookie = request.cookies['admin-auth'];
    const userCookie = request.cookies['user-auth'];

    if (adminCookie && roles.includes(ROLE.ADMIN)) {
      return true;
    } else if (userCookie && roles.includes(ROLE.USER)) {
      return true;
    }

    return false;
  }
}
