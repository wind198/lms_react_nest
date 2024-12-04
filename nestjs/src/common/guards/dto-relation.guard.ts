import { FastifyRequest } from 'fastify';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { ICheckDtoRelationScope } from '../types/check-dto-relation-scope';

@Injectable()
export class DtoRelationGuard implements CanActivate {
  private readonly logger = new Logger(DtoRelationGuard.name);

  constructor(private reflector: Reflector, private moduleRef: ModuleRef) {}

  async canActivate(context: ExecutionContext) {
    const handler = context.getHandler();
    const handlerName = handler.name;
    const handlersToCheck = ['create', 'createMany', 'update', 'updateMany'];
    if (!handlersToCheck.includes(handlerName)) {
      return true;
    }
    const controllerClass = context.getClass();
    const controllerInstance: ICheckDtoRelationScope = this.moduleRef.get(
      controllerClass,
      {
        strict: false,
      },
    );
    if (!controllerInstance || !controllerInstance.checkDtoRelationScope) {
      return true;
    }
    const request: FastifyRequest = context.switchToHttp().getRequest();
    const body = request.body;
    const { userId, type } = request.user;
    const { projects } = request;

    const dtoValid = await controllerInstance.checkDtoRelationScope(
      body,
      userId,
      type,
      projects,
    );

    if (dtoValid) {
      return true;
    }
    return false;
  }
}
