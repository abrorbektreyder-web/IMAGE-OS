import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { TryonService } from './tryon.service';

@Controller('tryon')
export class TryonController {
  constructor(private readonly tryonService: TryonService) {}

  /**
   * POST /api/v1/tryon/run
   * Body: { humanImageBase64, garmentImageBase64, mimeType?, clothType? }
   * 1. Uploads both images to fal.ai storage
   * 2. Runs IDM-VTON inference
   * 3. Returns resultImageUrl
   */
  @Post('run')
  @HttpCode(200)
  async run(@Body() body: any) {
    const { humanImageBase64, garmentImageBase64, mimeType = 'image/jpeg', clothType = 'upper' } = body;

    const resultImageUrl = await this.tryonService.runTryon(
      humanImageBase64,
      garmentImageBase64,
      mimeType,
      clothType
    );

    return { imageUrl: resultImageUrl };
  }
}
