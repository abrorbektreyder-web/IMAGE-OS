// ==========================================
// MODULE NAMES (Visual Builder Categories)
// ==========================================
export type ModuleName =
  | 'IDENTITY'
  | 'WARDROBE'
  | 'ACCESSORIES'
  | 'LOCATION'
  | 'BACKGROUND'
  | 'TIME_OF_DAY'
  | 'WEATHER'
  | 'POSE'
  | 'FACIAL_EXPRESSION'
  | 'LIGHTING'
  | 'CAMERA'
  | 'IMAGE_QUALITY'
  | 'NEGATIVE_PROMPT';

// ==========================================
// SELECTION (What user chooses per module)
// ==========================================
export interface ModuleSelectionPayload {
  moduleName: ModuleName;
  presetId?: string;
  customValue?: string;
}

// ==========================================
// PROMPT COMPOSER INPUT/OUTPUT
// ==========================================
export interface PromptComposerInput {
  projectId: string;
  selections: ModuleSelectionPayload[];
}

export interface PromptComposerOutput {
  positivePrompt: string;
  negativePrompt: string;
  warnings: CompatibilityWarning[];
  version: number;
}

// ==========================================
// COMPATIBILITY & RULE ENGINE
// ==========================================
export interface CompatibilityWarning {
  level: 'INFO' | 'WARNING' | 'CONFLICT';
  message: string;
  affectedModules: ModuleName[];
}

export interface RuleCheckResult {
  passed: boolean;
  warnings: CompatibilityWarning[];
}

// ==========================================
// AI PROVIDER ADAPTER (Phase 2 & 3)
// ==========================================
export interface ImageGenerationRequest {
  positivePrompt: string;
  negativePrompt: string;
  referenceImageUrl?: string;
  aspectRatio?: string;
  seed?: number;
}

export interface InpaintingRequest {
  referenceImageUrl: string;
  clothingImageUrl: string;
  maskPoints?: number[][];
}

export interface AIProviderResponse {
  jobId: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  outputUrl?: string;
  errorMessage?: string;
}

// ==========================================
// PRESET & KNOWLEDGE BASE
// ==========================================
export interface PresetItem {
  id: string;
  name: string;
  description?: string;
  promptChunk: string;
  negPrompt?: string;
  tags: string[];
  categorySlug: string;
}

// ==========================================
// SUBSCRIPTION
// ==========================================
export type SubscriptionPlan = 'FREE' | 'PRO' | 'STUDIO' | 'ENTERPRISE';

export interface UserCredits {
  plan: SubscriptionPlan;
  credits: number;
  renewDate: string;
}
