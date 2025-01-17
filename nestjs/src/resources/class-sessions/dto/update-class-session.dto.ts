import { PartialType } from '@nestjs/mapped-types';
import { CreateClassSessionDto } from '@resources/class-sessions/dto/create-class-session.dto';

export class UpdateClassSessionDto extends PartialType(CreateClassSessionDto) {}
