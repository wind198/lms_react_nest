import { SetMetadata } from '@nestjs/common';
import { UserType } from '@prisma/client';

export const REQUIRE_ROLE = 'REQUIRE_ROLE';
export const RequireRole = (roles: UserType[]) =>
  SetMetadata(REQUIRE_ROLE, roles);
