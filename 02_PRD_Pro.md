# AI ImageOS - 02 Product Requirements Document (PRD)
**Version:** 1.0 (PRO Edition)  
**Author:** Lead Product Architect & Director of Creative Operations  

---

## 1. User Personas

### Persona A: The Social Media Brand Manager (SMM)
*   **Goal:** Generate consistent social media content for a fashion brand using the same model without paying for photoshoots.
*   **Need:** Upload a model's reference image and swap out 50 different outfits in different locations (poolside, cafe, office) while keeping the face 100% consistent.
*   **Pain Point:** Cannot write complex prompts and is frustrated by Midjourney changing the model's face.

### Persona B: The Professional Art Director / Agency Designer
*   **Goal:** Create storyboards and high-fidelity mockups for luxury clients.
*   **Need:** Fast generation of specific scenes with precise control over camera angles, lighting conditions (e.g., golden hour natural light), and mood.
*   **Pain Point:** Spends hours engineering prompts and correcting AI hallucinations.

---

## 2. Epics & User Stories

### Epic 1: The Visual Constructor UI (Phase 1)
*   *As a user,* I want to select visual parameters from graphical cards instead of typing descriptions, so I don't need prompt engineering skills.
*   *As a user,* I want to see my uploaded reference image on the screen, so I have visual reassurance and confirmation of the model I am directing.
*   *As a user,* I want to add optional custom notes to any module to override presets.

### Epic 2: Mantiq va Moslik (Rule & Compatibility Engine) (Phase 1)
*   *As a user,* I want the platform to automatically warn me when I select conflicting settings (e.g., "Night" + "Midday Sunlight"), so I don't generate broken prompts.
*   *As a user,* I want the platform to recommend complementary settings (e.g., selecting "Beach" automatically suggests "Ocean waves" and "Sun reflections"), so my scenes look professional.

### Epic 3: AI Prompt Composer (Phase 1)
*   *As a developer,* I want the system to prepend a static, highly detailed generic identity prompt (Identity Lock) describing skin pores, iris details, and facial anatomy, so the external AI renders maximum realism.
*   *As a user,* I want to download or copy the positive and negative prompts in one click, so I can use them in Midjourney or Flux.

### Epic 4: Direct AI Generation & Try-On (Phases 2 & 3)
*   *As a user,* I want to click a button and generate the image directly inside the platform using my API key or credits, so I don't have to copy-paste.
*   *As a fashion store owner,* I want to upload a clothing image and have it realistically swappable onto my model in real-time, keeping the model's exact face and body proportions.

---

## 3. Scope & Prioritization Matrix (MOSCOW)

### Must Have (Phase 1 - MVP)
*   Visual Builder layout (10 core modules: Identity, Wardrobe, Accessories, Location, Background, Pose, Facial Expression, Lighting, Camera, Image Quality).
*   Static generic "Identity Lock" template prepended to the prompt.
*   Reference Image Upload widget (UI only, no backend analysis).
*   Rule Engine validation for critical conflicts (Time vs. Lighting, Location vs. Weather).
*   One-click prompt export to Clipboard and TXT format.
*   Project Dashboard and History (versioning selections so old prompt states are never lost).

### Should Have (Phase 2)
*   Direct API integration with Flux and Midjourney (Replicate/ImagineAPI adapters).
*   Credit System (token billing per generation).
*   Dynamic preset search and admin dashboard to edit the Knowledge Base.

### Could Have (Phase 3)
*   Virtual Try-On (Inpainting API using IDM-VTON).
*   Custom background replacement (preserving model and clothes, changing environment).

### Won't Have (V1)
*   Local GPU generation (too expensive; must use API adapters).
*   Real-time video prompt generation.

---

## 4. Product Boundaries & Constraints

1.  **Strict Client-Side Validation:** The UI must validate selections immediately (e.g., showing a warning next to the "Lighting" field if it conflicts with "Time of Day").
2.  **No Identity Overwrite:** The Identity Lock prompt block must be immutable; the client-side code cannot disable it, as it is the core feature of the platform.
3.  **Anonymity of Reference:** No user facial/biometric data is analyzed, processed, or saved to satisfy global privacy laws (GDPR/CCPA). The image is stored in S3/R2 only for the user's workspace UI representation.

---
