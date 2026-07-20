import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProjectModule } from './modules/project/project.module';
import { PromptComposerModule } from './modules/prompt-composer/prompt-composer.module';
import { KnowledgeModule } from './modules/knowledge/knowledge.module';
import { TryonModule } from './modules/tryon/tryon.module';
import { GenerateModule } from './modules/generate/generate.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    // Load .env globally
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: ['apps/api/.env', '.env'],
    }),

    // Core platform modules
    PrismaModule,
    ProjectModule,
    PromptComposerModule,
    KnowledgeModule,
    TryonModule,
    GenerateModule,
  ],
})
export class AppModule {}

