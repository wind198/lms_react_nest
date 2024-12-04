import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { FastifyRequest } from 'fastify';
import { isValidObjectId } from 'mongoose';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LogService } from '../../log/log.service';
import { ACTION_KEY } from '../decorators/action.decorator';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  logService: LogService;

  constructor(
    private readonly moduleRef: ModuleRef,
    private readonly reflector: Reflector, // Add Reflector to retrieve metadata
  ) {
    this.logService = moduleRef.get(LogService, { strict: false });
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    const { method, query, body } = request;
    const url = request.originalUrl;

    const controllerClass = context.getClass();
    const controllerInstance = this.moduleRef.get(controllerClass, {
      strict: false,
    });
    const { email: userEmail, userId, isApi = false } = request.user ?? {};

    const handler = context.getHandler(); // Get the handler (method) in the controller
    const representationField = controllerInstance.representationField ?? 'id';

    const segments = url.split('/').filter(Boolean);
    let resource = segments[0];
    if (resource === 'ext') {
      resource = segments.slice(0, 2).join('/');
    }
    const lastPathSegment = segments[segments.length - 1];

    let message = '';
    const searchParams = query as any;
    const log = {
      action: method as any,
      message: '',
      resource,
      routerPath: url,
      isApi,
      ...(userId && { user: userId }),
      level: 'DEBUG',
    } as any;

    const handleAsyncOperations = async () => {
      const firstSegment = segments[0];
      if (['agents'].includes(firstSegment)) {
        return;
      }

      // If the method is GET, fallback to the metadata ACTION if available
      if (method === 'GET') {
        const actionMetadata = this.reflector.get<string>(ACTION_KEY, handler); // Retrieve metadata
        if (actionMetadata) {
          log.action = actionMetadata; // Use metadata for action if available
          message = `${actionMetadata} at following route ${url}`;
        }
      } else if (method === 'DELETE') {
        if (searchParams.ids) {
          message = `Delete ${resource} with following ids **JSON${JSON.stringify(
            searchParams.ids,
          )}**JSON**`;
        } else if (isValidObjectId(lastPathSegment)) {
          const match = await controllerInstance?.getOne(
            lastPathSegment,
            request,
          );
          message = `Delete ${resource} with id ${lastPathSegment} (${
            match?.[representationField] ?? 'Not found'
          })`;
        } else {
          message = `Delete ${resource} at following route ${url}`;
        }
      } else if (method === 'PATCH') {
        if (searchParams.ids) {
          message = `Update ${resource} with following ids **JSON${JSON.stringify(
            searchParams.ids,
          )}**JSON** with following payload **JSON${JSON.stringify(
            body,
          )}**JSON`;
        } else if (isValidObjectId(lastPathSegment)) {
          const match = await controllerInstance?.getOne(
            lastPathSegment,
            request,
          );
          message = `Update ${resource} with id ${lastPathSegment} (${
            match?.[representationField] ?? 'Not found'
          }) with following payload **JSON${JSON.stringify(body)}**JSON`;
        } else {
          message = `Update ${resource} at following route ${url} with following payload **JSON${JSON.stringify(
            body,
          )}**JSON`;
        }
      } else if (method === 'POST' && !url.includes('get-list')) {
        if (resource.toLowerCase() === 'auth') {
          if (url.includes('login')) {
            message = `User login attempt: ${(body as any)?.email}`;
          }
        } else {
          message = `Create ${resource} with following payload **JSON${JSON.stringify(
            body,
          )}**JSON`;
        }
      }

      if (message) {
        if (userEmail) {
          message = `User ${userEmail}: ${message}`;
        }
        log.message = message;
        if (this.logService) {
          this.logService.logModel.create({ ...log, type: 'CRUD' });
        }
      }
    };

    return from(handleAsyncOperations()).pipe(switchMap(() => next.handle()));
  }
}
