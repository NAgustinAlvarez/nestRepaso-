import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostType, Status } from './dtos/create-post.dto';
import { MetaOptions } from 'src/meta-options/meta-option.entity';
import { User } from 'src/users/user.entity';
import { Tag } from 'src/tags/tag.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

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

  @ManyToMany(() => Tag, (tag) => tag.posts, { eager: true })
  @JoinTable()
  tags?: Tag[];

  @OneToOne(() => MetaOptions, (metaOptions) => metaOptions.post, {
    cascade: ['remove', 'insert'],
    eager: true,
    nullable: true,
  })
  metaOptions: MetaOptions | null;

  @ManyToOne(() => User, (user) => user.post, { eager: true })
  author: User;
}
