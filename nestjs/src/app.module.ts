import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './resources/users/users.module';
import { UsersService } from './resources/users/users.service';
import { TempKeysModule } from './temp-keys/temp-keys.module';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: MAIL_HOST,
        port: MAIL_PORT,
        secure: MAIL_SECURE ? true : false,
        auth: {
          user: MAIL_USER,
          pass: MAIL_PASSWORD,
        },
        secureConnection: false,
        tls: { rejectUnauthorized: false },
      },
      defaults: {
        from: `${FROM_NAME}<${MAIL_FROM}>`,
        replyTo: `${FROM_NAME}<performance.support@niteco.com>`,
      },
    }),
    PrismaModule,
    UsersModule,
    TempKeysModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private userService: UsersService) {}

  async onApplicationBootstrap() {
    await this.userService.mockUsers(10);
  }
}
