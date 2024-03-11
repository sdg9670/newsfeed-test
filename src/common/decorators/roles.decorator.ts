import { ReflectableDecorator, Reflector } from '@nestjs/core';
import { ROLE } from '../models/role.model';

export const Roles: ReflectableDecorator<ROLE[], ROLE[]> =
  Reflector.createDecorator<ROLE[]>();
