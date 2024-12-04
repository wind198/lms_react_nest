import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ProjectService } from '../../project/project.service';
import { rolesWithSuperAdminRole } from '../constants';

@Injectable()
export class AddUserInfoInterceptor implements NestInterceptor {
  constructor(
    private readonly moduleRef: ModuleRef, // Inject ModuleRef
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    const { user } = request;

    const addUserInfo = async () => {
      if (!user) return;
      const projectService = this.moduleRef.get(ProjectService, {
        strict: false,
      });
      const relatedProjects = await projectService.findNonDeleted().find({
        ...(rolesWithSuperAdminRole.includes(user.type) && {
          $or: [{ admins: user.userId }, { members: user.userId }],
        }),
      });

      request.projects = relatedProjects
        .map(({ id, admins, members }) => {
          if (rolesWithSuperAdminRole.includes(user.type)) {
            return { id, role: 'admin' as const };
          }
          // @ts-expect-error
          if (admins.includes(user.userId)) {
            return { id, role: 'admin' as const };
          }
          // @ts-expect-error
          if (members.includes(user.userId)) {
            return { id, role: 'member' as const };
          }
          return;
        })
        .filter(Boolean);
      if (user.projects?.length) {
        request.projects = request.projects.filter(({ id }) =>
          user.projects.includes(id),
        );
      }
    };

    return from(addUserInfo()).pipe(switchMap(() => next.handle()));
  }
}
