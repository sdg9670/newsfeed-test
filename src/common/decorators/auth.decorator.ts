// get admin and user cookies by decorator

import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { AuthEntity } from '../models/auth.model';

export const Auth: (...dataOrPipes: unknown[]) => ParameterDecorator =
  createParamDecorator<unknown, ExecutionContext, Partial<AuthEntity>>(
    (data: unknown, ctx: ExecutionContext): Partial<AuthEntity> => {
      const adminCookie: string | undefined = ctx
        .switchToHttp()
        .getRequest<Request>().cookies['admin-auth'];
      const userCookie: string | undefined = ctx
        .switchToHttp()
        .getRequest<Request>().cookies['user-auth'];

      const admin: { id: string; email: string } | undefined =
        adminCookie !== undefined ? JSON.parse(adminCookie) : undefined;
      const user: { id: string; email: string } | undefined =
        userCookie !== undefined ? JSON.parse(userCookie) : undefined;

      return {
        admin,
        user,
      };
    },
  );
