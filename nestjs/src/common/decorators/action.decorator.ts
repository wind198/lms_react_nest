import { SetMetadata } from '@nestjs/common';

export const ACTION_KEY = 'ACTION';
export const Action = (v: string) => SetMetadata(ACTION_KEY, v);
