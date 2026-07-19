# AI ImageOS - 04 Technical Architecture
**Version:** 1.0 (PRO Edition)  
**Author:** Lead Product Architect & Director of Creative Operations  

---

## 1. High-Level Technology Stack

ImageOS is designed with a modern, decoupled architecture to ensure V1 is extremely cheap to run, while making the integration of V2 (APIs) and V3 (Try-On) seamless.

*   **Frontend Framework:** Next.js (React, TypeScript, App Router).
*   **Styling Engine:** Tailwind CSS & shadcn/ui.
*   **Backend Server:** NestJS (TypeScript, Node.js REST API).
*   **Database ORM:** Prisma ORM.
*   **Database Engine:** PostgreSQL (transactional storage).
*   **Caching & Session Store:** Redis (for session management and selection caching).
*   **Asset Storage:** Cloudflare R2 / S3 (for reference images and exported files).
*   **Authentication:** Better Auth (supporting Email/Password and Google/GitHub OAuth).

---

## 2. Directory & Architecture Layout

A monorepo structure is recommended for development velocity and sharing types between the Frontend and Backend:

```
imageos/
├── apps/
│   ├── web/ (Next.js Frontend)
│   │   ├── src/
│   │   │   ├── components/ (Visual Cards, Upload Area, Prompt Preview)
│   │   │   ├── hooks/ (usePromptComposer, useValidation)
│   │   │   └── pages/ / app/
│   └── api/ (NestJS Backend)
│       ├── src/
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   ├── project/ (CRUD + Selection history)
│       │   │   ├── knowledge-base/ (Presets & Rules)
│       │   │   └── prompt-composer/ (The Compilation Engine)
│       │   └── common/ (Middlewares, Guards, Filters)
├── packages/
│   ├── database/ (Prisma schema & client)
│   └── types/ (Shared TypeScript interfaces for selections & configs)
```

---

## 3. Backend Core Engines Architecture

The Prompt Composer module in NestJS coordinates multiple standalone micro-services:

```
[Client Selections JSON]
          │
          ▼
┌──────────────────┐
│  Request Guard   │ (Validates Auth & Payload structure)
└─────────┬────────┘
          │
          ▼
┌──────────────────┐
│ Identity Engine  │ (Injects the immutable generic Identity Lock chunk)
└─────────┬────────┘
          │
          ▼
┌──────────────────┐
│ Knowledge Engine │ (Fetches preset text templates from DB/Redis cache)
└─────────┬────────┘
          │
          ▼
┌──────────────────┐
│   Rule Engine    │ (Applies conditional recommends/excludes to prompt text)
└─────────┬────────┘
          │
          ▼
┌──────────────────┐
│  Compat Engine   │ (Scans final tokens for conflicts; throws soft warnings)
└─────────┬────────┘
          │
          ▼
┌──────────────────┐
│ Composer Service │ (Concatenates strings & outputs positive/negative prompt)
└──────────────────┘
```

---

## 4. API Adapter Layer (Phase 2 & Phase 3 Integration)

To support future AI providers without changing the core codebase, we introduce an **AI Provider Adapter Interface**. Any generation API (e.g., Midjourney ImagineAPI, Replicate Flux, fal.ai IDM-VTON) must implement this interface:

```typescript
// packages/types/src/ai-provider.interface.ts

export interface ImageGenerationRequest {
  positivePrompt: string;
  negativePrompt: string;
  referenceImageUrl?: string;
  aspectRatio: string;
  seed?: number;
}

export interface InpaintingRequest {
  referenceImageUrl: string;
  clothingImageUrl: string; // Used in V3 Virtual Try-On
  maskPoints?: number[][];
  promptOverride?: string;
}

export interface AIProviderResponse {
  jobId: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  outputUrl?: string;
  errorMessage?: string;
}

export interface IAIProviderAdapter {
  generateImage(payload: ImageGenerationRequest): Promise<AIProviderResponse>;
  checkStatus(jobId: string): Promise<AIProviderResponse>;
  inpaintingTryOn(payload: InpaintingRequest): Promise<AIProviderResponse>;
}
```

By coding to this interface, changing the generation provider in Phase 2/3 requires only writing a new adapter class (e.g., `FluxReplicateAdapter`, `MidjourneyImagineAdapter`) and registering it in the NestJS dependency injection.

---

## 5. Phase 3 Virtual Try-On (Inpainting Engine) Workflow

When the user requests a clothing swap in Phase 3:
1.  The client uploads the `Reference Image` and select/uploads `Target Clothing`.
2.  The backend calls `Inpainting Engine` (running `IDM-VTON` via Replicate or fal.ai API).
3.  The API takes the clothing mato (fabric texture, shape) and wraps it over the reference image's body mask.
4.  The output returns the exact character with the new clothing rendered, maintaining the face parameters from the reference image.

---
