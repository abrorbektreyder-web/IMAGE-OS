# AI ImageOS - 03 Functional Specification
**Version:** 1.0 (PRO Edition)  
**Author:** Lead Product Architect & Director of Creative Operations  

---

## 1. User Interface & Layout Structure

The platform uses a three-column modern desktop layout designed for efficiency and visual feedback:

```
+-----------------------------------------------------------------------------+
|                                  ImageOS NAVBAR                             |
+---------------------+---------------------------------+---------------------+
|                     |                                 |                     |
|  LEFT PANEL:        |  CENTER PANEL:                  |  RIGHT PANEL:       |
|  Reference Image &  |  Visual Builder Preset Cards    |  Live Output &      |
|  Project Details    |  (10 Modular Categories)        |  Validation Status  |
|                     |                                 |                     |
|  +---------------+  |  [ Wardrobe ]                   |  +---------------+  |
|  | Upload Box    |  |  [ Accessories ]                |  | Final Prompt  |  |
|  +---------------+  |  [ Location ]                   |  | (Positive)    |  |
|  | Visual View   |  |  [ Background ]                 |  | [Copy]        |  |
|  +---------------+  |  [ Pose ]                       |  +---------------+  |
|  | Project Meta  |  |  [ Facial Expression ]          |  | Negative      |  |
|  | - Name        |  |  [ Lighting ]                   |  | [Copy]        |  |
|  | - History     |  |  [ Camera & Lens ]              |  +---------------+  |
|  +---------------+  |  [ Quality ]                    |  | Compatibility  |  |
|                     |  [ Negative ]                   |  | Messages      |  |
|                     |                                 |  +---------------+  |
+---------------------+---------------------------------+---------------------+
```

---

## 2. Screen Modules & Features

### Module 01: Project Dashboard
*   **Grid View:** Displays all active projects with thumbnail previews of the Reference Image.
*   **Search & Filters:** Filter by category, project name, or creation date.
*   **Actions:** Create Project, Duplicate (clones selections but keeps original reference image), Archive, Delete.

### Module 02: Reference Image Upload Widget
*   **UI Drag-and-Drop Area:** Supports JPG, PNG, WEBP files up to 20MB.
*   **Reset/Delete Button:** Clears the image preview.
*   *Note:* The upload does not invoke any backend AI APIs in V1. It acts strictly as a visual anchor on the Left Panel for the user's guidance.

### Module 03: Visual Builder (Modular Form Inputs)
The core builder is composed of **10 sequential modules**. Selecting a module card expands its panel, displaying:
1.  **Search Input:** Real-time search of presets within the category.
2.  **Visual Presets Grid:** Interactive cards containing preset titles and descriptions.
3.  **Custom Notes Textarea (Optional):** Allows writing custom override descriptions.
4.  **Status Indicator:** Green (compatible), Yellow (warning), Red (critical conflict).

---

## 3. Presets & Rule Engine Catalog (Examples)

### Module A: Camera & Lens (Presets)
*   **Preset 1: "85mm Portrait Close-up"**
    *   *Prompt Chunk:* `Eye-level camera, three-quarter body portrait, subject centered, sharp focus on the face, 85mm portrait lens, shallow depth of field, professional luxury editorial composition.`
    *   *Rules:* Automatically recommends `Portrait composition` and `Shallow depth of field`.
*   **Preset 2: "24mm Wide-Angle Landscape"**
    *   *Prompt Chunk:* `Wide-angle perspective, full-body shot, expansive environment, deep depth of field, 24mm wide-angle lens, cinematic composition.`
    *   *Rules:* Conflicts with `Shallow depth of field` and `Extreme close-up`.

### Module B: Location & Environment (Presets)
*   **Preset 1: "Luxury Poolside"**
    *   *Prompt Chunk:* `Inside an ultra-luxury infinity swimming pool, crystal-clear turquoise blue water, large contemporary luxury villa, five-star resort atmosphere, premium marble pool deck, elegant tropical landscaping.`
    *   *Rules:* Automatically recommends `Water reflections` and `Bright natural sunlight`.
*   **Preset 2: "Penthouse Master Bedroom"**
    *   *Prompt Chunk:* `Inside an ultra-luxury master bedroom, a spacious modern penthouse bedroom, large king-size bed, premium bedding, elegant bedside tables, large floor-to-ceiling windows.`
    *   *Rules:* Automatically recommends `Soft warm ambient lighting` or `Indoor studio lighting`.

---

## 4. Compatibility Engine & Validation Logic

The platform monitors conflicts as choices are selected:

| Preset Selected | Second Preset Selected | Status | Platform Action |
| :--- | :--- | :--- | :--- |
| **Location:** Penthouse | **Weather:** Snowing (indoor) | **Warning** | Displays message: "Warning: Snowing weather is active while character is indoors. Ensure windows are visible." |
| **Time:** Night | **Lighting:** Bright Midday Sun | **Conflict** | Displays error: "Conflict: Cannot have bright midday sunlight at night. Please change Lighting to Moonlight or Studio." |
| **Lens:** 85mm Portrait | **Composition:** Panoramic Landscape | **Warning** | Displays message: "Recommended: Portrait composition works best with an 85mm portrait lens." |

---

## 5. Prompt Composer Pipeline

When the user clicks "Compose Prompt" (or in real-time as selections change), the backend compiles the final string following this strict order:

```
[IDENTITY LOCK]
(Immutable detailed facial/anatomy prompt)
↓
[WARDROBE] + [ACCESSORIES]
(Selected clothing + jewelry text + Custom wardrobe notes)
↓
[LOCATION] + [BACKGROUND]
(Selected location + background text)
↓
[POSE] + [FACIAL EXPRESSION]
(Selected pose + expression details)
↓
[LIGHTING]
(Lighting style + time of day + reflections)
↓
[CAMERA & LENS]
(Camera angle + lens compression + focus details)
↓
[IMAGE QUALITY]
(Photorealistic, cinematic rendering, HDR tokens)
```

The compiled output is rendered in the Right Panel in two separate boxes:
1.  **Positive Prompt:** Ready for copying.
2.  **Negative Prompt:** Pre-filled negative tokens + selected exclusions.

---
