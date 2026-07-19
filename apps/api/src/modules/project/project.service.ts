import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(workspaceId: string) {
    return this.prisma.project.findMany({
      where: { workspaceId },
      include: { referenceImage: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        referenceImage: true,
        selections: { include: { preset: true } },
        prompts: { orderBy: { createdAt: 'desc' }, take: 1 },
      },
    });
  }

  async create(workspaceId: string, name: string, description?: string) {
    return this.prisma.project.create({
      data: { workspaceId, name, description },
    });
  }

  async update(id: string, name: string, description?: string) {
    return this.prisma.project.update({
      where: { id },
      data: { name, description },
    });
  }

  async remove(id: string) {
    return this.prisma.project.delete({ where: { id } });
  }
}
