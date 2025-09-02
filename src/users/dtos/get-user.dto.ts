/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class GetUsersParamDto {
  @ApiProperty({ description: 'Get user whit a specific id', example: '1234' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  id?: number;
}
