import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProjectModule } from './modules/project/project.module';
import { PromptComposerModule } from './modules/prompt-composer/prompt-composer.module';
import { KnowledgeModule } from './modules/knowledge/knowledge.module';
import { TryonModule } from './modules/tryon/tryon.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    // Load .env globally
    ConfigModule.forRoot({ isGlobal: true }),

    // Core platform modules
    PrismaModule,
    ProjectModule,
    PromptComposerModule,
    KnowledgeModule,
    TryonModule,
  ],
})
export class AppModule {}

