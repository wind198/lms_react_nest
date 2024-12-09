import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import {
  EDUCATION_BACKGROUND,
  GENDER,
  Prisma,
  User,
  UserType,
} from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { range, sample, shuffle, times } from 'lodash';
import { PrismaService } from '../../prisma/prisma.service';
import { IUserCoreField } from './entities/user.entity';
import { hashPassword } from '@/common/helpers';
import { ROOT_USER_EMAIL } from '@/common/constants/config';
import { IActivable } from '@/common/types/index';

@Injectable()
export class UsersService {
  userModel: Prisma.UserDelegate<DefaultArgs>;
  constructor(private prisma: PrismaService) {
    this.userModel = prisma.client.user;
  }

  async countEmailDuplication(email: string) {
    const count = await this.userModel.count({ where: { email: email } });

    return count;
  }

  generateRandomPassword(length = 12) {
    const charSets = [
      'abcdefghijklmnopqrstuvwxyz',
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      '0123456789',
      '!@#$%^&*()-_=+[]{}|;:,.<>?',
    ];

    // Ensure at least one character from each set
    let password = charSets.map((set) => sample(set)).join('');

    // Fill the rest with random characters from all sets
    const allChars = charSets.join('');
    password += times(length - password.length, () => sample(allChars)).join(
      '',
    );

    // Shuffle the password
    return shuffle(password.split('')).join('');
  }

  async mockUsers(count: number, userType: UserType, generation_id?: number) {
    const data = await Promise.all(
      range(count).map(async (_) => {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = faker.internet.email({ firstName, lastName });

        return {
          email,
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`,
          education_background: sample(
            Object.keys(EDUCATION_BACKGROUND),
          ) as EDUCATION_BACKGROUND,
          address: faker.location.streetAddress(),
          phone: faker.phone.number(),
          gender: sample(Object.keys(GENDER)) as GENDER,
          dob: faker.date.birthdate(),
          user_type: userType,
          generation_id: generation_id ?? null,
          password: await hashPassword(this.generateRandomPassword()),
          is_active: true,
        } satisfies IUserCoreField & { password: string } & IActivable;
      }),
    );
    return this.userModel.createMany({ data });
  }

  getFullname(user: User) {
    const { first_name, last_name } = user;
    return `${first_name} ${last_name}`;
  }

  async mockRootUser() {
    return await this.userModel.create({
      data: {
        is_active: true,
        email: ROOT_USER_EMAIL,
        first_name: 'Root Admin',
        last_name: 'User',
        full_name: 'Root Admin User',
        education_background: EDUCATION_BACKGROUND.MASTER,
        address: 'Admin Address',
        phone: '1234567890',
        gender: GENDER.MALE,
        dob: new Date(),
        user_type: 'ADMIN',
        password: await hashPassword('password'),
      },
    });
  }
}
