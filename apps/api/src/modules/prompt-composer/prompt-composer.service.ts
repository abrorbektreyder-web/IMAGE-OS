import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  IDENTITY_LOCK_PROMPT,
  STANDARD_NEGATIVE_PROMPT,
} from './constants/identity-lock.constant';
import type {
  PromptComposerInput,
  PromptComposerOutput,
  CompatibilityWarning,
} from '@imageos/types';

@Injectable()
export class PromptComposerService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Main entry point.
   * Compiles all user selections into a structured prompt.
   */
  async compose(input: PromptComposerInput): Promise<PromptComposerOutput> {
    const { projectId, selections } = input;

    // 1. Run compatibility checks
    const warnings = this.runCompatibilityChecks(selections);

    // 2. Fetch preset prompt chunks from DB
    const presetChunks = await this.resolvePresetChunks(selections);

    // 3. Build ordered positive prompt
    const positivePrompt = this.buildPositivePrompt(presetChunks, selections);

    // 4. Build negative prompt
    const negativePrompt = this.buildNegativePrompt(selections);

    // 5. Save to prompt history
    const saved = await this.prisma.promptHistory.create({
      data: {
        projectId,
        positivePrompt,
        negativePrompt,
      },
    });

    return {
      positivePrompt,
      negativePrompt,
      warnings,
      version: saved.version,
    };
  }

  // -------------------------------------------------------
  // Private: Resolve preset prompt chunks from DB
  // -------------------------------------------------------
  private async resolvePresetChunks(
    selections: PromptComposerInput['selections'],
  ): Promise<Record<string, string>> {
    const chunks: Record<string, string> = {};

    for (const sel of selections) {
      if (sel.presetId) {
        const preset = await this.prisma.preset.findUnique({
          where: { id: sel.presetId },
          select: { promptChunk: true },
        });
        if (preset) {
          chunks[sel.moduleName] = preset.promptChunk;
        }
      }

      // Custom notes always override preset if both are provided
      if (sel.customValue) {
        const existing = chunks[sel.moduleName] ?? '';
        chunks[sel.moduleName] = existing
          ? `${existing} ${sel.customValue}`
          : sel.customValue;
      }
    }

    return chunks;
  }

  // -------------------------------------------------------
  // Private: Assemble positive prompt in defined order
  // -------------------------------------------------------
  private buildPositivePrompt(
    chunks: Record<string, string>,
    selections: PromptComposerInput['selections'],
  ): string {
    const order: string[] = [
      'IDENTITY',       // Always first (locked)
      'WARDROBE',
      'ACCESSORIES',
      'LOCATION',
      'BACKGROUND',
      'TIME_OF_DAY',
      'WEATHER',
      'POSE',
      'FACIAL_EXPRESSION',
      'LIGHTING',
      'CAMERA',
      'IMAGE_QUALITY',
    ];

    const parts: string[] = [IDENTITY_LOCK_PROMPT];

    for (const moduleName of order) {
      if (moduleName === 'IDENTITY') continue; // Already added
      if (chunks[moduleName]) {
        parts.push(chunks[moduleName]);
      }
    }

    return parts.join('\n\n');
  }

  // -------------------------------------------------------
  // Private: Build negative prompt
  // -------------------------------------------------------
  private buildNegativePrompt(
    selections: PromptComposerInput['selections'],
  ): string {
    const customNegative = selections
      .find((s) => s.moduleName === 'NEGATIVE_PROMPT')
      ?.customValue ?? '';

    return customNegative
      ? `${STANDARD_NEGATIVE_PROMPT}, ${customNegative}`
      : STANDARD_NEGATIVE_PROMPT;
  }

  // -------------------------------------------------------
  // Private: Simple compatibility rule checks
  // -------------------------------------------------------
  private runCompatibilityChecks(
    selections: PromptComposerInput['selections'],
  ): CompatibilityWarning[] {
    const warnings: CompatibilityWarning[] = [];
    const get = (mod: string) =>
      selections.find((s) => s.moduleName === mod);

    const time = get('TIME_OF_DAY');
    const lighting = get('LIGHTING');

    // Night + Midday Sun
    if (
      time?.customValue?.toLowerCase().includes('night') &&
      lighting?.customValue?.toLowerCase().includes('midday')
    ) {
      warnings.push({
        level: 'CONFLICT',
        message:
          'Conflict: Cannot use Midday Sun lighting at Night. Change lighting to Moonlight or Studio.',
        affectedModules: ['TIME_OF_DAY', 'LIGHTING'],
      });
    }

    return warnings;
  }
}
