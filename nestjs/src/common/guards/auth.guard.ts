import { REFRESH_TOKEN } from '@/common/constants';
import { JWT_SECRET } from '@/common/constants/config';
import { TempKeysService } from '@/temp-keys/temp-keys.service';
import { IS_PUBLIC_KEY } from '@decorators/is-public.decorator';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

// declare global {
// namespace Express {
//   interface User {
//     email: string;
//     userId: string;
//   }
// }
// }
export type IRequestProjectInfo = { id: string; role: 'admin' | 'member' };

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private tempkeyService: TempKeysService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const routePath = request.url;

    const token = this.extractJwtFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Authorization token not found');
    }
    try {
      const payload: Request['user'] = await this.jwtService.verifyAsync(
        token,
        {
          secret: JWT_SECRET,
        },
      );
      if (payload.tempKeyData) {
        const matchTempKey = await this.tempkeyService.tempKeysModel.findFirst({
          where: { id: payload.tempKeyData.id },
        });
        if (!matchTempKey) {
          throw new UnauthorizedException('Authorization key is invalid');
        }

        const { purpose } = matchTempKey;

        if (
          purpose === 'ACTIVATE_USER' &&
          routePath !== '/auth/activate-user'
        ) {
          throw new UnauthorizedException(
            'Token is only used for user activation',
          );
        }
        if (purpose === 'RESET_PASSWORD' && routePath !== '/auth/reset-pass') {
          throw new UnauthorizedException(
            'Token is only used for password reset',
          );
        }
      }
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch (e) {
      console.error(e);
      throw new UnauthorizedException(
        e.message ??
          `Unexpected error occured, we can't authorize your identity at the moment`,
      );
    }
    return true;
  }

  extractJwtFromCookie(req: Request) {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies[REFRESH_TOKEN];
    }
    return token;
  }

  extractJwtFromHeader(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return null;
    }

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' && token ? token : null;
  }
}
