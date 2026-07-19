import { Injectable, BadRequestException } from '@nestjs/common';
import * as ReplicateModule from 'replicate';
const Replicate = (ReplicateModule as any).default || ReplicateModule;

export type ClothType = 'upper_body' | 'lower_body' | 'dresses';

@Injectable()
export class TryonService {
  private replicate: any;

  constructor() {
    this.replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN || '',
    });
  }

  async runTryon(humanBase64: string, garmentBase64: string, mimeType: string, clothType: string = 'upper_body'): Promise<string> {
    try {
      if (!process.env.REPLICATE_API_TOKEN) {
        throw new BadRequestException('REPLICATE_API_TOKEN not configured in .env');
      }

      // Map our frontend types to Replicate input types
      let category = 'upper_body';
      if (clothType === 'lower') category = 'lower_body';
      if (clothType === 'dresses') category = 'dresses';

      // Replicate accepts base64 data URIs
      const humanDataUri = humanBase64.startsWith('data:') ? humanBase64 : `data:${mimeType};base64,${humanBase64}`;
      const garmentDataUri = garmentBase64.startsWith('data:') ? garmentBase64 : `data:${mimeType};base64,${garmentBase64}`;

      console.log('Starting Replicate IDM-VTON...');
      const output: any = await this.replicate.run(
        "cuuupid/idm-vton:c871bb9b046607b680449ecbae55fd8c6d945e0a1948644bf2361b3d021d3ff4",
        {
          input: {
            crop: false,
            seed: 42,
            steps: 30,
            category: category,
            garm_img: garmentDataUri,
            human_img: humanDataUri,
            garment_des: `a ${category} item`
          }
        }
      );

      console.log('Replicate output:', output);

      // Replicate IDM-VTON usually returns a URL string as the output
      if (typeof output === 'string') {
        return output;
      } else if (Array.isArray(output)) {
        return output[0];
      } else if (output && output.url) {
        return output.url;
      }

      throw new Error('Unknown output format from Replicate');
    } catch (error: any) {
      console.error('Replicate TryOn Error:', error);
      throw new BadRequestException(error.message || 'Replicate API call failed');
    }
  }
}

