import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../users/users.service';
import { REQUIRE_ROLE } from '../decorators/require-role.decorator';
import { IS_PUBLIC_KEY } from '../decorators/is-public.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private userService: UsersService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      REQUIRE_ROLE,
      [context.getHandler(), context.getClass()],
    );

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    if (!requiredRoles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId;

    const matchUser = await this.userService.userModel.findById(userId);

    if (!matchUser || !requiredRoles.includes(matchUser.type)) {
      throw new ForbiddenException('You are not allowed to access this route');
    }

    return true;
  }
}
