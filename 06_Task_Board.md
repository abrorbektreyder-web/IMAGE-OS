# AI ImageOS - 06 Task Board & Sprints
**Version:** 1.0 (PRO Edition)  
**Author:** Lead Product Architect & Director of Creative Operations  

Use this document to track the progress of development. Mark tasks as in-progress `[/]` or completed `[x]` as we go.

---

## 📅 Chronological Sprints

### Sprint 1: Project Setup & Monorepo Configuration
- [ ] **Task 1.1:** Initialize monorepo directory layout (`apps/web`, `apps/api`, `packages/database`, `packages/types`).
- [ ] **Task 1.2:** Configure `package.json` workspaces and TypeScript configs.
- [ ] **Task 1.3:** Setup Next.js boilerplate in `apps/web` with Tailwind CSS and shadcn/ui.
- [ ] **Task 1.4:** Setup NestJS boilerplate in `apps/api` with Fastify (or Express) and CORS configured.
- [ ] **Task 1.5:** Configure Prisma Schema with PostgreSQL connection inside `packages/database`.

---

### Sprint 2: Core Prompt Composer & Rule Engine (V1 Local Logic)
- [ ] **Task 2.1:** Implement the static, detailed `Identity Lock` template block inside backend config.
- [ ] **Task 2.2:** Code the `Prompt Composer Service` in NestJS (concatenation pipelines for 10 categories).
- [ ] **Task 2.3:** Code the local `Rule Engine` parser (deterministic IF-THEN mapping).
- [ ] **Task 2.4:** Code the `Compatibility Engine` (validating conflicting selections, throwing soft warnings).
- [ ] **Task 2.5:** Create Next.js mock data and test compiler logic locally without a database.

---

### Sprint 3: UI Visual Constructor & Database Wiring (V1 Release)
- [ ] **Task 3.1:** Build the 3-column desktop layout (Left: Upload/Meta, Center: Preset Cards, Right: Output/Warnings).
- [ ] **Task 3.2:** Build the Reference Image Upload widget (UI drag-and-drop, showing loaded asset).
- [ ] **Task 3.3:** Build the 10 Visual Preset Category cards with real-time selection state in React.
- [ ] **Task 3.4:** Setup PostgreSQL locally (or docker container) and deploy Prisma migrations.
- [ ] **Task 3.5:** Build NestJS endpoints for Project CRUD and Selection save/history rollback.
- [ ] **Task 3.6:** Wire Frontend components to Backend REST API.
- [ ] **Task 3.7:** Implement One-click "Copy Prompt" and "Export TXT" functionality.

---

### Sprint 4: Authentication, Admin Panels & API Adapters (V2 Pre-requisites)
- [ ] **Task 4.1:** Integrate Better Auth inside NestJS and Next.js (supporting Google OAuth & Credentials).
- [ ] **Task 4.2:** Create the Admin Dashboard UI to create, edit, and delete Presets, Categories, and Rules.
- [ ] **Task 4.3:** Build the `IAIProviderAdapter` class inside Backend to abstract generation providers.
- [ ] **Task 4.4:** Write the `FluxReplicateAdapter` to call Replicate API using positive/negative prompt and reference image.
- [ ] **Task 4.5:** Implement the user Billing/Credits system in PostgreSQL to limit API usage.

---

### Sprint 5: Virtual Try-On & Live Image Playground (V3 Launch)
- [ ] **Task 5.1:** Build the "AI Visual Studio" panel in Next.js (displaying direct generated images side-by-side with reference).
- [ ] **Task 5.2:** Implement the `Try-On Inpainting Service` in NestJS using the `fal.ai` IDM-VTON API.
- [ ] **Task 5.3:** Create the Try-On UI widget (allowing the user to upload a secondary clothing image to swap over the model).
- [ ] **Task 5.4:** Write E2E tests for the try-on pipeline and launch the platform.

---

## 📈 Current Project Progress Status

```
[░░░░░░░░░░░░░░░░░░░░] 0% Completed
```
*(Progress bar will be updated as sprints and tasks are checked off).*
