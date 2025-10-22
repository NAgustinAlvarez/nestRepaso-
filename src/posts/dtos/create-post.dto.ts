import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CreatePostMetaOptionsDto } from '../../meta-options/dtos/create-post-metadata.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum PostType {
  POST = 'post',
  PAGE = 'page',
  STORY = 'story',
  REVIEW = 'review',
  PUBLISHED = 'published',
}

export enum Status {
  DRAFT = 'draft',
  SCHEDULE = 'schedule',
  REVIEW = 'review',
  PUBLISHED = 'published',
}

export class CreatePostDto {
  @ApiProperty({
    description: 'This is the title for the blog post',
    example: 'This is the title',
  })
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Type of the post',
    enum: PostType,
    example: PostType.POST,
  })
  @IsEnum(PostType)
  @IsNotEmpty()
  postType: PostType;

  @ApiProperty({
    description:
      'URL friendly slug. Lowercase letters, numbers and hyphens only.',
    example: 'my-first-post',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(256)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'A slug should be all small letters and uses only "-" without spaces. For example "my-url"',
  })
  slug: string;

  @ApiProperty({
    description: 'Status of the post',
    enum: Status,
    example: Status.DRAFT,
  })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @ApiPropertyOptional({
    description: 'Optional content of the post',
    example: 'This is the content of the post',
  })
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description: 'Optional JSON schema for the post',
    example: '{"type":"object","properties":{"example":{"type":"string"}}}',
  })
  @IsOptional()
  @IsJSON()
  schema?: string;

  @ApiPropertyOptional({
    description: 'Optional URL for the featured image',
    example: 'https://example.com/image.jpg',
  })
  @IsOptional()
  @IsUrl()
  @MaxLength(1024)
  featuredImageUrl?: string;

  @ApiPropertyOptional({
    description: 'Optional publish date in ISO 8601 format',
    example: '2025-09-01T12:00:00.000Z',
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  publishOn?: Date;

  @ApiPropertyOptional({
    description: 'Array of ids of tags',
    example: [1, 2],
    isArray: true,
    type: String,
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  tags?: number[];

  @ApiPropertyOptional({
    type: () => CreatePostMetaOptionsDto,
    description: 'Opciones de metadatos para el post',
    example: { metaValue: '{"sidebarEnabled": true}' },
  })
  @IsOptional()
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions?: CreatePostMetaOptionsDto | null;

  @ApiProperty({ type: 'integer', required: true, example: 1 })
  @IsInt()
  @IsNotEmpty()
  authorId: number;
}
