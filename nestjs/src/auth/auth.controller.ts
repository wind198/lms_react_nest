import { UpdatePasswordDto } from '@/auth/dto/update-password.dto';
import { UpdateProfileDto } from '@/auth/dto/update-profile.dto';
import { REFRESH_TOKEN } from '@/common/constants';
import { hashPassword } from '@/common/helpers';
import { IAccessRight } from '@/common/types';
import { UsersService } from '@/resources/users/users.service';
import { Public } from '@decorators/is-public.decorator';
import { IS_RESOURCE } from '@decorators/is_resource.decorator';
import { REQUIRE_ROLE } from '@decorators/require-role.decorator';
import { ThrowNotFoundOrReturn } from '@decorators/throw-not-found-or-return.decorator';
import {
  Body,
  Controller,
  Get,
  OnApplicationBootstrap,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import {
  BadRequestException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserType } from '@prisma/client';
import { compareSync } from 'bcrypt';
import { Request, Response } from 'express';
import { get, isEmpty, set } from 'lodash';
import { AuthService } from './auth.service';
import { ActivateUserDto } from './dto/activate-user.dto';
import { LoginDto } from './dto/login.dto';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { ResetPasswordDto } from './dto/reset-pass.dto';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user: {
        email: string;
        userId: number;
        type: UserType;
        tempKeyData?: {
          id: number;
        };
      };
    }
  }
}

@Controller('auth')
export class AuthController implements OnApplicationBootstrap {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private jwtService: JwtService,
    private reflector: Reflector,
    private discoveryService: DiscoveryService,
    private metadataScanner: MetadataScanner,
  ) {}

  onApplicationBootstrap() {
    const output = {} as Record<string, any>;

    const controllers = this.discoveryService
      .getControllers()
      .map((i) => i.instance)
      .filter(Boolean);

    controllers.filter((i) => {
      const prototype = Object.getPrototypeOf(i);
      const resource = this.reflector.get(IS_RESOURCE, prototype.constructor);
      if (resource) {
        const prototype = Object.getPrototypeOf(i);
        const methodNames = this.metadataScanner.getAllMethodNames(i);
        methodNames.forEach((name) => {
          const method = prototype[name];
          const requiredRole = this.reflector.getAllAndOverride(REQUIRE_ROLE, [
            ...(method ? [method] : []),
            prototype.constructor,
          ]);
          if (name === 'create') {
            set(
              output,
              [resource, 'create'],
              !requiredRole?.length ? '*' : requiredRole,
            );
          } else if (
            ['getOne', 'getMany', 'getListPaging'].includes(name) &&
            !get(output, [resource, 'list'])
          ) {
            set(
              output,
              [resource, 'list'],
              !requiredRole?.length ? '*' : requiredRole,
            );
          } else if (name === 'update') {
            set(
              output,
              [resource, 'update'],
              !requiredRole?.length ? '*' : requiredRole,
            );
          } else if (name === 'delete') {
            set(
              output,
              [resource, 'delete'],
              !requiredRole?.length ? '*' : requiredRole,
            );
          }
        });
      }
    });

    this.userTypeBaseAccess = output;
  }

  userTypeBaseAccess: Record<
    string,
    Record<IAccessRight, '*' | Array<string>>
  > = {};

  @Public()
  @Post('login')
  async login(
    @Body() signInDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token, userAuthData } = await this.authService.login(
      signInDto.email,
      signInDto.password,
    );

    this.attachRefreshTokenCookie(res, token);
    return userAuthData;
  }

  @Public()
  @Post('logout')
  async logout() {
    res.clearCookie(REFRESH_TOKEN);
    res.send();
  }

  @Public()
  @Post('request-reset-password')
  async requestResetPassword(@Body() body: RequestResetPasswordDto) {
    const { email } = body;

    const match = await this.userService.userModel.findFirst({
      where: {
        email,
        deleted_at: null,
      },
    });
    if (!match) {
      throw new NotFoundException('Email not found');
    }
    if (!match.is_active) {
      throw new BadRequestException(
        'Your account is not yet activated. Please contact the administrator.',
      );
    }
    await this.authService.sendResetPasswordEmail(match);
    return true;
  }

  @Post('activate-user')
  async activateUser(
    @Body() body: ActivateUserDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user;
    if (!user?.userId) {
      throw new BadRequestException('User not found.');
    }
    const { password } = body;
    const match = await this.userService.userModel.update({
      where: {
        id: user.userId,
        deleted_at: null,
      },
      data: {
        password: await hashPassword(password),
        is_active: true,
      },
    });
    if (!match) {
      throw new BadRequestException('User not found.');
    }

    const token = await this.authService.generateJwtToken({
      userId: match.id,
      email: match.email,
      type: match.user_type,
    });

    this.attachRefreshTokenCookie(res, token);

    return true;
  }

  @Post('reset-pass')
  async resetPass(
    @Body() body: ResetPasswordDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user;
    if (!user?.userId) {
      throw new BadRequestException('User not found.');
    }
    const { password } = body;
    const match = await this.userService.userModel.update({
      where: {
        id: user.userId,
        deleted_at: null,
      },
      data: {
        password: await hashPassword(password),
      },
    });
    if (!match) {
      throw new BadRequestException('User not found.');
    }

    res.clearCookie(REFRESH_TOKEN);

    return true;
  }

  @Public()
  @Post('validate-activation-key')
  async validateActivationKey(
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { activationKey } = body ?? {};

    const tempKey = await this.authService.validateTempKey(
      activationKey,
      'ACTIVATE_USER',
    );
    if (!tempKey) {
      throw new BadRequestException(
        'Your activation key is invalid. Please contact the administrator.',
      );
    }
    try {
      const payload = await this.jwtService.verifyAsync(tempKey.value);
      this.attachRefreshTokenCookie(res, tempKey.value);

      return payload;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'Your activation key is invalid. Please contact the administrator.',
      );
    }
  }

  @Public()
  @Post('validate-reset-pass-key')
  async validateResetPassKey(
    @Body() body: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { activationKey } = body ?? {};

    const tempKey = await this.authService.validateTempKey(
      activationKey,
      'RESET_PASSWORD',
    );
    if (!tempKey) {
      throw new BadRequestException(
        'Your key is invalid. Please contact the administrator.',
      );
    }
    try {
      const payload = await this.jwtService.verifyAsync(tempKey.value);
      this.attachRefreshTokenCookie(res, tempKey.value);

      return payload;
    } catch (error) {
      console.error(error);
      throw new BadRequestException(
        'Your key is invalid. Please contact the administrator.',
      );
    }
  }

  @Post('check-current-password')
  async checkMyPassword(
    @Body() body: { password: string },
    @Req() req: Request,
  ) {
    const password = body.password;
    if (!password) {
      return false;
    }
    const userId = req.user.userId;

    const userProfile = await this.userService.userModel.findFirst({
      where: { id: userId, is_active: true },
    });

    if (!userProfile) {
      throw new NotFoundException('User not found');
    }

    const isMatch = compareSync(password, userProfile.password);
    return isMatch;
  }

  @Get('profile')
  async getProfile(@Req() req: Request) {
    const userId = req.user.userId;

    const userProfile = await this.userService.userModel.findFirst({
      where: {
        id: userId,
        is_active: true,
      },
    });
    if (!userProfile) {
      throw new UnauthorizedException('User profile not found');
    }
    return userProfile;
  }

  @Get('permissions')
  async getUserPermisson(@Req() req: Request) {
    const userId = req.user.userId;

    const userProfile = await this.userService.userModel.findFirst({
      where: {
        id: userId,
      },
    });
    if (!userProfile) {
      throw new UnauthorizedException('User not found');
    }
    if (isEmpty(this.userTypeBaseAccess)) {
      throw new ServiceUnavailableException(
        'Service is temporarily unavailable',
      );
    }

    const userType = userProfile.user_type;

    const output = Object.entries(this.userTypeBaseAccess).map(
      ([resource, data]) => {
        const { create, delete: $delete, update, list } = data;

        return {
          resource,
          create: !!(create === '*' || create?.includes(userType)),
          list: !!(list === '*' || list?.includes(userType)),
          update: !!(update === '*' || update?.includes(userType)),
          delete: !!($delete === '*' || $delete?.includes(userType)),
        };
      },
    );
    return output;

    // const resourceControllers = this.discoveryService
    //   .getControllers()
    //   .map((i) => i.instance)
    //   .filter(Boolean)
    //   .filter((i) => {
    //     const prototype = Object.getPrototypeOf(i);
    //     const resource = this.reflector.get(IS_RESOURCE, prototype.constructor);
    //     return resource === qr.resource;
    //   });

    // if (!resourceControllers) {
    //   throw new ServiceUnavailableException(
    //     'Service is temporarily unavailable',
    //   );
    // }
  }

  @ThrowNotFoundOrReturn()
  @Patch('profile/user-info')
  async updateProfile(@Req() req: Request, @Body() body: UpdateProfileDto) {
    const userId = req.user.userId;

    return await this.userService.userModel.update({
      where: { id: userId, is_active: true },
      data: body,
    });
  }

  @ThrowNotFoundOrReturn()
  @Patch('profile/update-password')
  async updatePassword(@Req() req: Request, @Body() body: UpdatePasswordDto) {
    const userId = req.user.userId;

    const userProfile = await this.userService.userModel.findFirst({
      where: { id: userId, is_active: true },
    });

    if (!userProfile) {
      return null;
    }
    const matchPassword = compareSync(
      body.currentPassword,
      userProfile.password,
    );

    if (!matchPassword) {
      throw new BadRequestException('Incorrect current password');
    }

    await this.userService.userModel.update({
      where: { id: userId, is_active: true },
      data: {
        password: await hashPassword(body.newPassword),
      },
    });
  }

  attachRefreshTokenCookie(res: Response, token: string) {
    res.cookie(REFRESH_TOKEN, token, {
      secure: false,
      httpOnly: true,
      sameSite: false,
      path: '/',
    });
  }
}
