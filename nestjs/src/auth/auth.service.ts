import { Response } from 'express';
import { renderToString } from 'react-dom/server';
import { Request } from 'express';
import { TempKeysService } from '@/temp-keys/temp-keys.service';
import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Inject,
  Injectable,
  Res,
  forwardRef,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { TempKey, TempKeyPurpose, User } from '@prisma/client';
import { UsersService } from '@resources/users/users.service';
import { compare } from 'bcrypt';
import { FE_ORIGIN, NODE_ENV } from '@/common/constants/config';
import { createElement } from 'react';
import ResetPassword from '@/template/reset-password';
import moment from 'moment';
import { REFRESH_TOKEN } from '@/common/constants';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
    @Inject(forwardRef(() => TempKeysService))
    private tempKeyService: TempKeysService,
    private mailerService: MailerService,
  ) {}

  async generateJwtToken(payload: any, options?: JwtSignOptions) {
    return await this.jwtService.signAsync(payload, options);
  }

  async generateTokenAndRefreshToken(payload: any) {
    return await Promise.all([
      this.generateJwtToken(payload, { expiresIn: 5 * 60 }),
      this.generateJwtToken(payload, { expiresIn: 60 * 60 * 24 * 7 }),
    ]);
  }

  async login(email: string, pass: string) {
    const user = await this.usersService.userModel.findFirst({
      where: { email, deleted_at: null },
    });
    if (!user) {
      throw new BadRequestException('Email not found');
    }
    if (!(await compare(pass, user.password))) {
      throw new BadRequestException('Password is incorrect');
    }
    if (!user.is_active) {
      throw new BadRequestException('Account is inactive');
    }
    const tokenPayload = {
      userId: user.id,
      email,
      type: user.user_type,
    };
    const [token, refreshToken] =
      await this.generateTokenAndRefreshToken(tokenPayload);
    const { password, ...o } = user;

    return {
      token,
      refreshToken,
      userAuthData: o,
    };
  }

  clearTokenFromCookie(res: Response) {
    res.clearCookie(REFRESH_TOKEN);
  }

  async validateTempKey(key: number, purpose: TempKeyPurpose) {
    if (!key) {
      return false;
    }
    const match = await this.tempKeyService.tempKeysModel.findUnique({
      where: { id: key },
    });
    if (!match || match.purpose !== purpose) {
      return false;
    }
    return match;
  }

  async sendResetPasswordEmail(user: User) {
    const userFriendlyName = this.usersService.getFullname(user);

    const tempKey = await this.tempKeyService.tempKeysModel.create({
      data: {
        description: `Activation key for ${user.email}`,
        purpose: 'RESET_PASSWORD',
        value: 'placeholder',
        expired_at: moment().add(30, 'minutes').toISOString(),
        user_id: user.id,
      },
    });

    const jwtPayload: Request['user'] = {
      userId: user.id,
      email: user.email,
      type: user.user_type,
      tempKeyData: {
        id: tempKey.id,
      },
    };

    const expireAfter = NODE_ENV === 'development' ? '10d' : '30min';

    const jwtKey = await this.generateJwtToken(jwtPayload, {
      expiresIn: expireAfter,
    });

    const activationStr = `${FE_ORIGIN}/auth/reset-password?reset-pass-key=${tempKey.id}`;

    const html = renderToString(
      createElement(ResetPassword, {
        userName: userFriendlyName,
        resetPasswordUrl: activationStr,
      }),
    );

    await Promise.all([
      this.mailerService.sendMail({
        to: user.email,
        subject:
          'Reset password for your Niteco Uptime Monitoring System account',
        html,
      }),
      this.tempKeyService.tempKeysModel.update({
        where: { id: tempKey.id },
        data: { value: jwtKey },
      }),
    ]);
  }
}
