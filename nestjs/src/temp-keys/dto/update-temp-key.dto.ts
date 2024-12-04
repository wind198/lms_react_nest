import { PartialType } from '@nestjs/mapped-types';
import { CreateTempKeyDto } from './create-temp-key.dto';

export class UpdateTempKeyDto extends PartialType(CreateTempKeyDto) {}
