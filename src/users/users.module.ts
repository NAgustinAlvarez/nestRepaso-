import { forwardRef, Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UserService } from './providers/users.service';
import { AuthModule } from 'src/auth/auth.module';
import { User } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [UsersController],
  providers: [UserService],
  imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([User])],
  exports: [UserService],
})
export class UsersModule {}
