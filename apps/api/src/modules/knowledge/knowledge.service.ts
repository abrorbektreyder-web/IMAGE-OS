import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class KnowledgeService {
  constructor(private readonly prisma: PrismaService) {}

  async getCategories() {
    return this.prisma.category.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async getPresetsByCategory(categorySlug: string) {
    return this.prisma.preset.findMany({
      where: { category: { slug: categorySlug }, isActive: true },
      orderBy: { sortOrder: 'asc' },
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
}
