import { SetMetadata } from '@nestjs/common';

export const IS_RESOURCE = 'isResource';
export const Resource = (s: string) => SetMetadata(IS_RESOURCE, s);
