import { Controller, Post, Body, HttpCode, BadRequestException } from '@nestjs/common';
import { GenerateService } from './generate.service';

@Controller('generate')
export class GenerateController {
  constructor(private readonly generateService: GenerateService) {}

  /**
   * POST /api/v1/generate
   * Body: { imageBase64, mimeType?, prompt }
   * Reference rasm + prompt -> yangi (identity saqlangan) rasm.
   * Qaytaradi: { imageUrl: "data:image/...;base64,..." }
   */
  @Post()
  @HttpCode(200)
  async generate(@Body() body: any) {
    const { imageBase64, mimeType = 'image/jpeg', prompt } = body || {};

    if (!imageBase64 || !prompt) {
      throw new BadRequestException('imageBase64 va prompt majburiy.');
    }

    const imageUrl = await this.generateService.generate(
      imageBase64,
      mimeType,
      prompt,
    );

    return { imageUrl };
  }
}
