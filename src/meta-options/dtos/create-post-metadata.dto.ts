import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsNotEmpty } from 'class-validator';

export class CreatePostMetaOptionsDto {
  @ApiProperty({
    type: String,
    description: 'The metaValue is a JSON string',
    example: { metaValue: '{"sidebarEnabled": true, "footerActive": true}' },
  })
  @IsNotEmpty()
  @IsJSON()
  metaValue: string;
}
