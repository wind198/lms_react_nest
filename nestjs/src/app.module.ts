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
import { RoomsModule } from '@resources/rooms/rooms.module';
import { RoomSettingsModule } from '@resources/roomSettings/room-settings.module';
import { MajorsModule } from '@resources/majors/majors.module';
import { CoursesModule } from '@resources/courses/courses.module';
import { MajorsService } from '@resources/majors/majors.service';
import { CoursesService } from '@resources/courses/courses.service';
import { RoomsService } from '@resources/rooms/rooms.service';
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
    RoomsModule,
    RoomSettingsModule,
    MajorsModule,
    CoursesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(
    private userService: UsersService,
    private majorService: MajorsService,
    private courseService: CoursesService,
    private roomService: RoomsService,
  ) {}

  async onApplicationBootstrap() {
    if (NODE_ENV !== 'production') {
      if (!(await this.userService.userModel.count())) {
        await this.userService.mockUsers(100, 'STUDENT');
        await this.userService.mockUsers(10, 'TEACHER');
        await this.userService.mockUsers(3, 'ADMIN');
        await this.userService.mockRootUser();
      }
      if (!(await this.majorService.majorModel.count())) {
        await this.majorService.mockMajor(5);
      }
      if (!(await this.roomService.roomModel.count())) {
        await this.roomService.mockRoom(5);
      }
      if (!(await this.courseService.courseModel.count())) {
        const firstMajor = await this.majorService.majorModel.findFirst();
        if (firstMajor) {
          await this.courseService.mockCourse(5, firstMajor.id);
        }
      }
    }
  }
}
