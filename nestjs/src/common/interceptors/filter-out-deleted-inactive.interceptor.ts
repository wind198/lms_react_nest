import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { FastifyRequest } from 'fastify';

@Injectable()
export class FilterOutDeletedInactiveInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    // Check if the request method is POST
    if (request.method === 'POST') {
      const { filter = {} } = request.body as any;

      // Add the deletedAt condition to the filter
      if (filter.deleteAt === undefined) {
        filter.deletedAt = null;
      }

      // Update the request body
      (request.body as any).filter = filter;
    }

    return next.handle();
  }
}
