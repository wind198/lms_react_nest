import { faker } from '@faker-js/faker/.';
import { hash } from 'bcrypt';
import { set } from 'lodash';
import moment from 'moment';

export const handleFilter = (
  where: any,
  filter: Record<string, any>,
  fields?: {
    dateFields?: string[];
    numberFields?: string[];
  },
) => {
  for (const k in filter) {
    const v = filter[k];

    if (fields?.dateFields?.includes(k)) {
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
