/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class GetUsersParamDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id?: number;
}
