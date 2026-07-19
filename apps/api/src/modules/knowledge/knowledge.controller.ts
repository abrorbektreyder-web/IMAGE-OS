import {
  Controller, Get, Post, Patch, Delete,
  Query, Param, Body,
} from '@nestjs/common';
import { KnowledgeService } from './knowledge.service';

@Controller('knowledge')
export class KnowledgeController {
  constructor(private readonly service: KnowledgeService) {}

  @Get('categories')
  getCategories() {
    return this.service.getCategories();
  }

  @Get('modules')
  getModules() {
    return this.service.getModules();
  }

  @Get('presets')
  getPresets(@Query('category') category: string) {
    return this.service.getPresetsByCategory(category);
  }

  @Get('search')
  search(@Query('q') query: string) {
    return this.service.searchPresets(query);
  }

  // ── Admin CRUD ─────────────────────────────────────
  @Post('presets')
  createPreset(@Body() body: any) {
    return this.service.createPreset(body);
  }

  @Patch('presets/:id')
  updatePreset(@Param('id') id: string, @Body() body: any) {
    return this.service.updatePreset(id, body);
  }

  @Delete('presets/:id')
  deletePreset(@Param('id') id: string) {
    return this.service.deletePreset(id);
  }
}
