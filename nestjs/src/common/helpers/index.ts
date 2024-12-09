import { Request } from 'express';
import { faker } from '@faker-js/faker';
import { hash } from 'bcrypt';
import { set } from 'lodash';
import moment from 'moment';
import { REFRESH_TOKEN } from '@/common/constants';

export const handleFilter = (
  where: any,
  filter: Record<string, any>,
  fields?: {
    dateFields?: string[];
    numberFields?: string[];
    searchFields?: string[];
    fullTextSearchFields?: string[];
  },
) => {
  for (const k in filter) {
    const v = filter[k];

    if (k === 'q') {
      if (
        v &&
        (fields?.searchFields?.length || fields?.fullTextSearchFields?.length)
      ) {
        set(
          where,
          ['OR'],
          (fields?.searchFields ?? [])
            .map((f) => ({ [f]: { contains: v } }))
            .concat(
              (fields?.fullTextSearchFields ?? []).map((f) => ({
                [f]: { search: v },
              })) as any,
            ),
        );
      }
    } else if (fields?.dateFields?.includes(k)) {
      if (typeof v === 'string' || typeof v === 'number') {
        set(where, k, moment(v).toISOString());
      } else {
        const { gte, lte, gt, lt } = v;
        Object.entries({ gte, lte, gt, lt }).forEach(
          ([filterKey, filterValue]) => {
            if (filterValue !== undefined) {
              set(where, [k, filterKey], filterValue);
            }
          },
        );
      }
    } else if (fields?.numberFields?.includes(k)) {
      if (typeof v === 'number') {
        set(where, k, v);
      } else {
        const { gte, lte, gt, lt } = v;
        Object.entries({ gte, lte, gt, lt }).forEach(
          ([filterKey, filterValue]) => {
            if (filterValue !== undefined) {
              set(where, [k, filterKey], filterValue);
            }
          },
        );
      }
    } else {
      set(where, k, v);
    }
  }
};

export const hashPassword = (password: string) =>
  hash(password, faker.number.int({ min: 5, max: 10 })); // Hash the password

export function extractJwtFromCookie(req: Request) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies[REFRESH_TOKEN];
  }
  return token;
}

export function extractJwtFromHeader(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return null;
  }

  const [type, token] = authHeader.split(' ');
  return type === 'Bearer' && token ? token : null;
}
