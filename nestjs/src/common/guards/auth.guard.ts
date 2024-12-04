import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';
import { JWT_SECRET } from '../../config';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/is-public.decorator';
import { TempKeyService } from '../../temp-key/temp-key.service';

// declare global {
// namespace Express {
//   interface User {
//     email: string;
//     userId: string;
//   }
// }
// }
export type IRequestProjectInfo = { id: string; role: 'admin' | 'member' };

declare module 'fastify' {
  interface FastifyRequest {
    projects?: IRequestProjectInfo[];
    user: {
      // field below are encoded into a JWT token
      email: string;
      userId: string;
      type: IUserType;
      tempKeyData?: {
        tempKeyId: string;
      };
      // field below are not encoded into a JWT token, but added after verified
      projects?: string[]; // added after verified
      isApi?: boolean; // added after verified
    };
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private tempkeyService: TempKeyService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request: FastifyRequest = context.switchToHttp().getRequest();
    const routePath = request.routeOptions.url;
    const method = request.method;

    const token =
      this.extractJwtFromCookie(request) ?? this.extractJwtFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Authorization token not found');
    }
    try {
      const payload: FastifyRequest['user'] = await this.jwtService.verifyAsync(
        token,
        {
          secret: JWT_SECRET,
        },
      );
      if (payload.tempKeyData) {
        const matchTempKey = await this.tempkeyService.tempKeyModel.findById(
          payload.tempKeyData.tempKeyId,
        );
        if (!matchTempKey) {
          throw new UnauthorizedException('Authorization key is invalid');
        }

        const { type, readonly } = matchTempKey;

        if (type === 'user-activation' && routePath !== '/auth/activate-user') {
          throw new UnauthorizedException(
            'Token is only used for user activation',
          );
        }
        if (type === 'reset-password' && routePath !== '/auth/reset-pass') {
          throw new UnauthorizedException(
            'Token is only used for password reset',
          );
        }
        if (type === 'api-token') {
          payload.isApi = true;
          if (
            readonly &&
            ['post', 'patch', 'delete'].includes(method) &&
            !routePath.includes('get-list')
          ) {
            throw new UnauthorizedException(
              'Token is only used to access readonly routes',
            );
          }
        }
        if (!matchTempKey.allowAccessAllProjects) {
          payload.projects =
            matchTempKey.allowedProjects?.map((i) => i._id.toString()) ?? [];
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

  extractJwtFromCookie(req: FastifyRequest) {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies[ACESS_TOKEN];
    }
    return token;
  }

  extractJwtFromHeader(req: FastifyRequest): string | null {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return null;
    }

    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' && token ? token : null;
  }
}
