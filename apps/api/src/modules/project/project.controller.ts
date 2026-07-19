import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProjectService } from './project.service';

@Controller('projects')
export class ProjectController {
  constructor(private readonly service: ProjectService) {}

  @Get('workspace/:workspaceId')
  findAll(@Param('workspaceId') workspaceId: string) {
    return this.service.findAll(workspaceId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(
    @Body()
    body: { workspaceId: string; name: string; description?: string },
  ) {
    return this.service.create(body.workspaceId, body.name, body.description);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: { name: string; description?: string },
  ) {
    return this.service.update(id, body.name, body.description);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
