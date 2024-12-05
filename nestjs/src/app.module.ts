import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './resources/users/users.module';
import { UsersService } from './resources/users/users.service';
import { TempKeysModule } from './temp-keys/temp-keys.module';

import { MailerModule } from '@nestjs-modules/mailer';
import {
  GMAIL,
  GMAIL_APP_PASSWORD,
  NODE_ENV,
  PUBLIC_PATH,
} from '@/common/constants/config';
import { AuthModule } from '@/auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        auth: {
          user: GMAIL,
          pass: GMAIL_APP_PASSWORD,
        },
      },
      defaults: {
        from: GMAIL,
        replyTo: GMAIL,
      },
    }),
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', PUBLIC_PATH),
    // }),
    PrismaModule,
    UsersModule,
    TempKeysModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private userService: UsersService) {}

  async onApplicationBootstrap() {
    if (NODE_ENV !== 'production') {
      if (!(await this.userService.userModel.count())) {
        await this.userService.mockUsers(100);
        await this.userService.mockRootUser();
      }
    }
  }
}
