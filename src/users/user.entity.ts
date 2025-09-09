import { Post } from 'src/posts/post.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 96, nullable: false })
  firstName: string;
  @Column({ type: 'varchar', length: 96, nullable: true })
  lastName: string;
  @Column({ type: 'varchar', length: 96, nullable: false })
  email: string;
  @Column({ type: 'varchar', length: 96, nullable: false, unique: true })
  password: string;
  @OneToMany(() => Post, (post) => post.author)
  post: Post[];
}
