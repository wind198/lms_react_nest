import { Module, forwardRef } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from '../common/constants/config';
import { UsersModule } from '@resources/users/users.module';
import { TempKeysModule } from '@/temp-keys/temp-keys.module';

@Module({
  imports: [
    DiscoveryModule,
    forwardRef(() => UsersModule),
    forwardRef(() => TempKeysModule),
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: '10d' },
      verifyOptions: {
        ignoreExpiration: false,
      },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
