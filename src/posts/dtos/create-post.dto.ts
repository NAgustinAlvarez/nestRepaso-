import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsISO8601,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreatePostMetaOptionsDto } from './create-post-metadata.dto';
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
  @IsISO8601()
  @IsOptional()
  publishOn?: Date;

  @ApiPropertyOptional({
    description: 'Optional list of tags for the post',
    example: ['nestjs', 'typescript', 'blog'],
    isArray: true,
    type: String,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  tags?: string[];

  @ApiPropertyOptional({
    type: 'array',
    required: false,
    items: {
      type: 'object',
      properties: {
        key: {
          type: 'string',
          description:
            'The key can be any string identifier for your meta option',
          example: 'sidebarEnabled',
        },
        value: {
          type: 'any',
          description: 'Any value that you want to save to the key',
          example: true,
        },
      },
    },
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePostMetaOptionsDto)
  metaOptions?: CreatePostMetaOptionsDto[];
}
