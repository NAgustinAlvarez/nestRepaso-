import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PostType, Status } from './dtos/create-post.dto';
import { CreatePostMetaOptionsDto } from './dtos/create-post-metadata.dto';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({
    type: 'enum',
    enum: PostType,
    nullable: false,
    default: PostType.POST,
  })
  postType: PostType;

  @Column({ type: 'varchar', length: 256, unique: true, nullable: false })
  slug: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.DRAFT,
  })
  status: Status;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'text', nullable: true })
  schema: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  featuredImageUrl: string;

  @Column({ type: 'timestamp', nullable: true }) //datetyme in mysql
  publishOn: Date;

  @Column('simple-array', { nullable: true })
  tags: string[];
  @Column({ type: 'jsonb', nullable: true })
  metaOptions: CreatePostMetaOptionsDto[];
}
