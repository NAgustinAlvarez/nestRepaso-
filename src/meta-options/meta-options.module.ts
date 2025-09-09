import { Module } from '@nestjs/common';
import { MetaOptionsService } from './providers/meta-options.service';
import { MetaOptionsController } from './meta-options.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MetaOptions } from './meta-option.entity';

@Module({
  controllers: [MetaOptionsController],
  providers: [MetaOptionsService],
  imports: [TypeOrmModule.forFeature([MetaOptions])],
})
export class MetaOptionsModule {}
