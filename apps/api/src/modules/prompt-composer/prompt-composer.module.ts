import { Module } from '@nestjs/common';
import { PromptComposerController } from './prompt-composer.controller';
import { PromptComposerService } from './prompt-composer.service';

@Module({
  controllers: [PromptComposerController],
  providers: [PromptComposerService],
  exports: [PromptComposerService],
})
export class PromptComposerModule {}
