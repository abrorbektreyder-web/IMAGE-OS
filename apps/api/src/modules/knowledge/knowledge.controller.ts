import { Controller, Get, Query } from '@nestjs/common';
import { KnowledgeService } from './knowledge.service';

@Controller('knowledge')
export class KnowledgeController {
  constructor(private readonly service: KnowledgeService) {}

  @Get('categories')
  getCategories() {
    return this.service.getCategories();
  }

  @Get('presets')
  getPresets(@Query('category') category: string) {
    return this.service.getPresetsByCategory(category);
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.service.searchPresets(query);
  }
}
