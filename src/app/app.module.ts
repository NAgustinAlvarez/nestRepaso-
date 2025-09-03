/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { UsersModule } from 'src/users/users.module';
import { AppController } from './app.controller';
import { PostsModule } from 'src/posts/posts.module';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { TagsModule } from 'src/tags/tags.module';
@Module({
  imports: [
    UsersModule,
    PostsModule,
    AuthModule,
    TagsModule,
    TypeOrmModule.forRootAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        type: 'postgres',
        entities: [User],
        synchronize: true,
        port: 5432,
        username: 'postgres',
        password: 'nico5329',
        host: 'localhost',
        database: 'postgres',
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
