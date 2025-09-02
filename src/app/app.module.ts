/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { UsersModule } from 'src/users/users.module';
import { AppController } from './app.controller';
import { PostsModule } from 'src/posts/posts.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [UsersModule, PostsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
