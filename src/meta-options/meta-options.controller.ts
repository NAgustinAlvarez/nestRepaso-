import { Controller } from '@nestjs/common';
import { MetaOptionsService } from './meta-options.service';

@Controller('meta-options')
export class MetaOptionsController {
  constructor(private readonly metaOptionsService: MetaOptionsService) {}
}
