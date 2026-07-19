import { Injectable, BadRequestException } from '@nestjs/common';
import { fal } from '@fal-ai/client';

export type ClothType = 'upper' | 'lower' | 'dresses';

@Injectable()
export class TryonService {
  constructor() {
    fal.config({ credentials: process.env.FAL_KEY });
  }

  async runTryon(humanImageUrl: string, garmentImageUrl: string, clothType: ClothType = 'upper') {
    if (!process.env.FAL_KEY) {
      throw new BadRequestException('FAL_KEY not configured');
    }

    const result = await fal.subscribe('fal-ai/idm-vton', {
      input: {
        human_img: humanImageUrl,
        garm_img: garmentImageUrl,
        garment_des: 'clothing item',
        is_checked: true,
        is_checked_crop: false,
        denoise_steps: 30,
        seed: 42,
      },
      logs: false,
    }) as any;

    return {
      imageUrl: result?.data?.image?.url ?? result?.data?.output ?? null,
      raw: result?.data,
    };
  }

  async uploadToFal(base64Data: string, mimeType: string): Promise<string> {
    const buffer = Buffer.from(base64Data.replace(/^data:\w+\/\w+;base64,/, ''), 'base64');
    const blob = new Blob([buffer], { type: mimeType });
    const url = await fal.storage.upload(blob);
    return url;
  }
}
