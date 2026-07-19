import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class KnowledgeService {
  constructor(private readonly prisma: PrismaService) {}

  async getCategories() {
    return this.prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async getModules() {
    return this.prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        presets: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
  }

  async getPresetsByCategory(categorySlug?: string) {
    return this.prisma.preset.findMany({
      where: categorySlug ? { category: { slug: categorySlug } } : {},
      orderBy: [{ category: { sortOrder: 'asc' } }, { sortOrder: 'asc' }],
      include: { category: { select: { name: true, slug: true } } },
    });
  }

  async searchPresets(query: string) {
    return this.prisma.preset.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { tags: { has: query } },
        ],
      },
    });
  }

  // ── Admin CRUD ─────────────────────────────────────

  async createPreset(data: any) {
    return this.prisma.preset.create({
      data: {
        categoryId: data.categoryId,
        slug: data.slug,
        name: data.name,
        description: data.description || null,
        promptChunk: data.promptChunk,
        isActive: data.isActive ?? true,
        sortOrder: data.sortOrder ?? 0,
      },
    });
  }

  async updatePreset(id: string, data: any) {
    return this.prisma.preset.update({
      where: { id },
      data: {
        ...(data.categoryId && { categoryId: data.categoryId }),
        ...(data.slug && { slug: data.slug }),
        ...(data.name && { name: data.name }),
        description: data.description ?? undefined,
        ...(data.promptChunk && { promptChunk: data.promptChunk }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      },
    });
  }

  async deletePreset(id: string) {
    return this.prisma.preset.delete({ where: { id } });
  }
}
