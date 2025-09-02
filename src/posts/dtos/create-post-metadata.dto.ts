import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostMetaOptionsDto {
  @IsNotEmpty()
  @IsString()
  key: string;
  @IsNotEmpty()
  value: any;
}
