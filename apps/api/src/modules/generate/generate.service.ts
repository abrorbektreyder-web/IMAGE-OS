import { Injectable, BadRequestException } from '@nestjs/common';

/**
 * Gemini "Nano Banana" orqali identity-preserving rasm generatsiyasi.
 * Kirish: reference rasm (base64) + yig'ilgan positive prompt.
 * Chiqish: yangi rasm (data:image/...;base64 URI).
 *
 * Model env orqali almashtiriladi (GEMINI_IMAGE_MODEL), standart —
 * gemini-2.5-flash-image. Arzonroq/yangiroqqa o'tish uchun faqat env
 * qiymatini o'zgartirish kifoya (kod tegmaydi).
 */
@Injectable()
export class GenerateService {
  private readonly model =
    process.env.GEMINI_IMAGE_MODEL || 'gemini-3.1-flash-lite-image';

  async generate(
    imageBase64: string,
    mimeType: string,
    prompt: string,
  ): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new BadRequestException(
        'GEMINI_API_KEY .env da sozlanmagan (apps/api/.env).',
      );
    }

    // "data:image/png;base64,...." prefiksini olib tashlaymiz — faqat baza64 kerak
    const base64 = imageBase64.includes(',')
      ? imageBase64.split(',')[1]
      : imageBase64;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent`;

    let res: Response;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                { text: prompt },
                { inline_data: { mime_type: mimeType, data: base64 } },
              ],
            },
          ],
          generationConfig: {
            responseModalities: ['IMAGE'],
          },
        }),
      });
    } catch (err: any) {
      throw new BadRequestException(
        `Gemini API ga ulanib bo'lmadi: ${err?.message || err}`,
      );
    }

    if (!res.ok) {
      const errText = await res.text();
      throw new BadRequestException(
        `Gemini API xatosi (${res.status}): ${errText}`,
      );
    }

    const data: any = await res.json();
    const parts: any[] = data?.candidates?.[0]?.content?.parts || [];

    for (const part of parts) {
      const inline = part.inlineData || part.inline_data;
      if (inline?.data) {
        const outMime = inline.mimeType || inline.mime_type || 'image/png';
        return `data:${outMime};base64,${inline.data}`;
      }
    }

    // Rasm yo'q — model matn qaytargan bo'lishi mumkin (rad etish / xavfsizlik filtri)
    const textPart = parts.find((p) => p.text)?.text;
    const blockReason =
      data?.promptFeedback?.blockReason || data?.candidates?.[0]?.finishReason;
    throw new BadRequestException(
      textPart ||
        `Model rasm qaytarmadi${blockReason ? ` (${blockReason})` : ''}. ` +
          'Boshqa rasm yoki sozlama bilan urinib ko\'ring.',
    );
  }
}
