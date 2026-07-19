# AI ImageOS - 05 Database Schema
**Version:** 1.0 (PRO Edition)  
**Author:** Lead Product Architect & Director of Creative Operations  

---

## 1. Relational Database Model Design

This schema is designed to be fully compatible with PostgreSQL and Prisma ORM. It natively supports multi-tenancy (Workspaces and Teams) to ensure the platform is enterprise-ready from Day 1, preventing costly migrations when transitioning from V1 to V2/V3.

```
+------------------+         +------------------+         +------------------+
|      User        | 1    N  |    Workspace     | 1    N  |     Project      |
|  (Auth details)  +-------->| (Team / Personal)+-------->| (Single Scene)   |
+------------------+         +------------------+         +--------┬---------+
                                                                   | 1
                                                                   |
                                                                   ▼ N
                                                          +------------------+
                                                          |  ModuleSelection |
                                                          | (Camera, Loc...) |
                                                          +--------┬---------+
                                                                   | 1
                                                                   |
                                                                   ▼ N
                                                          +------------------+
                                                          |   PromptHistory  |
                                                          | (Pos/Neg versions|
                                                          +------------------+
```

---

## 2. Complete Prisma Schema Definition

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ==========================================
// 1. User & Workspace Management (Multi-tenant)
// ==========================================

model User {
  id            String          @id @default(uuid())
  email         String          @unique
  name          String?
  avatarUrl     String?
  role          UserRole        @default(USER)
  status        UserStatus      @default(ACTIVE)
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
  
  // Relations
  memberships   WorkspaceMember[]
  subscriptions Subscription[]
  favorites     FavoritePreset[]
}

enum UserRole {
  USER
  ADMIN
  CREATIVE_DIRECTOR
}

enum UserStatus {
  ACTIVE
  SUSPENDED
  DEACTIVATED
}

model Workspace {
  id          String            @id @default(uuid())
  name        String
  slug        String            @unique
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
  
  // Relations
  members     WorkspaceMember[]
  projects    Project[]
}

model WorkspaceMember {
  id          String            @id @default(uuid())
  workspaceId String
  userId      String
  role        MemberRole        @default(MEMBER)
  joinedAt    DateTime          @default(now())
  
  workspace   Workspace         @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user        User              @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([workspaceId, userId])
}

enum MemberRole {
  OWNER
  ADMIN
  MEMBER
  VIEWER
}

// ==========================================
// 2. Project & Visual Composer Models
// ==========================================

model Project {
  id             String            @id @default(uuid())
  workspaceId    String
  name           String
  description    String?
  categoryId     String?
  createdAt      DateTime          @default(now())
  updatedAt      DateTime          @updatedAt
  
  // Relations
  workspace      Workspace         @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  category       Category?         @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  referenceImage ReferenceImage?
  selections     ModuleSelection[]
  prompts        PromptHistory[]
  exports        ExportRecord[]
}

model ReferenceImage {
  id         String   @id @default(uuid())
  projectId  String   @unique
  storageUrl String   // S3/R2 path
  filename   String
  fileSize   Int
  mimeType   String
  width      Int?
  height     Int?
  createdAt  DateTime @default(now())
  
  project    Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
}

model ModuleSelection {
  id          String   @id @default(uuid())
  projectId   String
  moduleName  String   // e.g. "CAMERA", "LIGHTING", "WARDROBE"
  presetId    String?  // Reference to static Preset
  customValue String?  // User's custom manual notes
  updatedAt   DateTime @updatedAt
  
  project     Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
  preset      Preset?  @relation(fields: [presetId], references: [id], onDelete: SetNull)

  @@unique([projectId, moduleName])
}

// ==========================================
// 3. Knowledge Base & Rules Engine
// ==========================================

model Category {
  id        String    @id @default(uuid())
  name      String    @unique // e.g. "Camera", "Lighting", "Fashion"
  slug      String    @unique
  projects  Project[]
  presets   Preset[]
}

model Preset {
  id          String            @id @default(uuid())
  categoryId  String
  name        String
  description String?
  promptChunk String            // The actual visual prompt fragment
  negPrompt   String?           // Exclusions
  tags        String[]
  isActive    Boolean           @default(true)
  createdAt   DateTime          @default(now())
  
  category    Category          @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  selections  ModuleSelection[]
  favorites   FavoritePreset[]
}

model Rule {
  id             String      @id @default(uuid())
  conditionField String      // e.g., "LOCATION"
  conditionValue String      // e.g., "Beach"
  actionType     RuleAction  // e.g., "RECOMMEND" or "EXCLUDE"
  targetField    String      // e.g., "LIGHTING"
  targetValue    String      // e.g., "Midday Sun"
  message        String?     // Warning message to display to user
  isActive       Boolean     @default(true)
}

enum RuleAction {
  RECOMMEND
  EXCLUDE
  WARN
}

// ==========================================
// 4. Output History & Logs
// ==========================================

model PromptHistory {
  id             String   @id @default(uuid())
  projectId      String
  positivePrompt String
  negativePrompt String
  version        Int      @default(1)
  createdAt      DateTime @default(now())
  
  project        Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
}

model FavoritePreset {
  id        String   @id @default(uuid())
  userId    String
  presetId  String
  createdAt DateTime @default(now())
  
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  preset    Preset   @relation(fields: [presetId], references: [id], onDelete: Cascade)

  @@unique([userId, presetId])
}

model ExportRecord {
  id        String   @id @default(uuid())
  projectId String
  format    String   // e.g. "TXT", "JSON", "CLIPBOARD"
  createdAt DateTime @default(now())
  
  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)
}

// ==========================================
// 5. Billing & Subscription Management
// ==========================================

model Subscription {
  id         String             @id @default(uuid())
  userId     String
  plan       SubscriptionPlan   @default(FREE)
  status     SubscriptionStatus @default(ACTIVE)
  credits    Int                @default(10) // Generation limits for V2
  renewDate  DateTime
  createdAt  DateTime           @default(now())
  
  user       User               @relation(fields: [userId], references: [id], onDelete: Cascade)
}

enum SubscriptionPlan {
  FREE
  PRO
  STUDIO
  ENTERPRISE
}

enum SubscriptionStatus {
  ACTIVE
  PAST_DUE
  CANCELED
  EXPIRED
}
```

---
