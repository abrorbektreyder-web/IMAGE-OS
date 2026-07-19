// ============================================================
// IDENTITY LOCK — Immutable Universal Human Anatomy Prompt
// This block is ALWAYS prepended to every generated prompt.
// It does NOT reference gender, age, or ethnicity.
// It describes universal human facial anatomy in extreme detail.
// ============================================================

export const IDENTITY_LOCK_PROMPT = `
REFERENCE IMAGE HAS HIGHEST PRIORITY.
Use the provided reference image as the only identity source.
Preserve the exact same person with maximum identity consistency.
Maintain identical: facial identity, facial structure, facial proportions,
eye shape, eye color, natural iris detail, pupil depth, eyebrows shape and density,
eyelashes length and curl, nose shape, nose bridge, nose tip, nostril shape,
lip shape, upper lip line, lower lip fullness, jawline contour, chin shape,
ear shape and placement, forehead width and height, cheekbone structure,
skin tone, skin texture, natural skin pores, natural skin details,
hairstyle, hairline, hair color, hair texture, body type, body proportions,
shoulder width, arm proportions, hand proportions, waist, hips, leg proportions,
height perception, age, gender, ethnicity.
Preserve all unique facial features.
Preserve natural facial asymmetry.
Do not redesign the character.
Do not beautify the face.
Do not modify anatomy.
Do not alter facial proportions.
Do not alter body proportions.
Do not generate a different person.
Maintain exact facial geometry.
Maintain exact eye spacing.
Maintain exact nose anatomy.
Maintain exact lips.
Maintain exact jawline.
Maintain exact ears.
Maintain exact hairstyle.
Maintain exact skin tone.
Maintain exact body proportions.
`.trim();

// ============================================================
// STANDARD NEGATIVE PROMPT — Always appended
// ============================================================

export const STANDARD_NEGATIVE_PROMPT = `
low quality, low resolution, blurry, soft focus, out of focus,
bad anatomy, bad hands, extra fingers, missing fingers,
deformed fingers, deformed body, wrong body proportions,
cropped, duplicate person, multiple people, face distortion,
identity drift, body morphing, plastic skin, oversharpened,
noise, grain, watermark, logo, text, cartoon, anime,
cgi, 3d render, unrealistic lighting, oversaturated,
underexposed, overexposed, ugly, deformed, disfigured
`.trim();
