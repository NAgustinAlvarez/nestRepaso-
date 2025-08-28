import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
//los campos serán todos opcionales.
export class PatchUserDto extends PartialType(CreateUserDto) {}
