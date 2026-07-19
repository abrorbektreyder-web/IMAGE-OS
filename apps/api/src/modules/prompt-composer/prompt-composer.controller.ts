import { Controller, Post, Body, Param } from '@nestjs/common';
import { PromptComposerService } from './prompt-composer.service';
import type { PromptComposerInput, PromptComposerOutput } from '@imageos/types';

@Controller('prompt-composer')
export class PromptComposerController {
  constructor(private readonly service: PromptComposerService) {}

  /**
   * POST /api/v1/prompt-composer/compose
   * Compiles all user selections into a production-ready prompt.
   */
  @Post('compose')
  async compose(
    @Body() input: PromptComposerInput,
  ): Promise<PromptComposerOutput> {
    return this.service.compose(input);
  }
}
