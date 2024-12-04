import { TempKeysService } from '@/temp-keys/temp-keys.service';
import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@resources/users/users.service';

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

  async signIn(email: string, pass: string) {
    const user = await this.usersService.findOneByEmail(email, true);
    if (!user) {
      throw new BadRequestException('Email not found');
    }
    if (!(await compare(pass, user.password))) {
      throw new BadRequestException('Password is incorrect');
    }
    if (!user.isActive) {
      throw new BadRequestException('Account is inactive');
    }
    const { id } = user;
    const token = await this.generateJwtToken({
      userId: id,
      email,
      type: user.type,
    });
    const { password, ...o } = user.toObject();

    return {
      token,
      userAuthData: o,
    };
  }

  async validateTempKey(key: string, keyType: ITempKeyType) {
    if (!key) {
      return false;
    }
    const match = await this.tempKeyService.tempKeyModel.findById(key);
    if (!match || match.type !== keyType) {
      return false;
    }
    return match;
  }

  async sendResetPasswordEmail(user: IUserDocument) {
    const userFriendlyName = getUserFriendlyName(user);

    const tempKey = await this.tempKeyService.tempKeyModel.create({
      note: `Activation key for ${user.email}`,
      type: 'reset-password',
      value: 'placeholder',
      user: user.id,
    });

    const jwtPayload: FastifyRequest['user'] = {
      userId: user.id,
      email: user.email,
      type: user.type,
      tempKeyData: {
        tempKeyId: tempKey.id,
      },
    };

    const expireAfter = NODE_ENV === 'development' ? '10d' : '30min';

    const jwtKey = await this.generateJwtToken(jwtPayload, {
      expiresIn: expireAfter,
    });

    const activationStr = `${FE_ORIGIN}/#/reset-password?reset-pass-key=${tempKey.id}`;

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
      tempKey.updateOne({ value: jwtKey }),
    ]);
  }
}
