import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MODULES = [
  {
    slug: 'WARDROBE',
    name: 'Wardrobe',
    description: 'Clothing and outfit choices',
    iconName: 'shirt',
    sortOrder: 1,
    presets: [
      { slug: 'w1', name: 'Silk Evening Gown', description: 'Floor-length, deep navy, off-shoulder', basePrompt: 'Silk Evening Gown, Floor-length, deep navy, off-shoulder' },
      { slug: 'w2', name: 'Casual Linen Shirt', description: 'Relaxed fit, cream white', basePrompt: 'Casual Linen Shirt, Relaxed fit, cream white' },
      { slug: 'w3', name: 'Leather Biker Jacket', description: 'Black, fitted, moto-style', basePrompt: 'Leather Biker Jacket, Black, fitted, moto-style' },
      { slug: 'w4', name: 'Athleisure Set', description: 'Sports bra + leggings, minimal', basePrompt: 'Athleisure Set, Sports bra + leggings, minimal' },
      { slug: 'w5', name: 'Business Suit', description: 'Tailored charcoal, slim fit', basePrompt: 'Business Suit, Tailored charcoal, slim fit' },
      { slug: 'w6', name: 'Summer Dress', description: 'Floral midi, flowing fabric', basePrompt: 'Summer Dress, Floral midi, flowing fabric' },
    ],
  },
  {
    slug: 'LOCATION',
    name: 'Location',
    description: 'Background environment',
    iconName: 'map-pin',
    sortOrder: 2,
    presets: [
      { slug: 'l1', name: 'Penthouse Rooftop', description: 'Manhattan skyline, dusk', basePrompt: 'Penthouse Rooftop, Manhattan skyline, dusk' },
      { slug: 'l2', name: 'Parisian Street', description: 'Cobblestone, Haussmann buildings', basePrompt: 'Parisian Street, Cobblestone, Haussmann buildings' },
      { slug: 'l3', name: 'Luxury Bedroom', description: 'Marble, king-size, ambient lighting', basePrompt: 'Luxury Bedroom, Marble, king-size, ambient lighting' },
      { slug: 'l4', name: 'Desert Landscape', description: 'Red sand dunes, golden hour', basePrompt: 'Desert Landscape, Red sand dunes, golden hour' },
      { slug: 'l5', name: 'Modern Studio', description: 'White backdrop, seamless floor', basePrompt: 'Modern Studio, White backdrop, seamless floor' },
      { slug: 'l6', name: 'Tropical Beach', description: 'Turquoise water, palm trees', basePrompt: 'Tropical Beach, Turquoise water, palm trees' },
    ],
  },
  {
    slug: 'TIME_OF_DAY',
    name: 'Time of Day',
    description: 'Time lighting context',
    iconName: 'clock',
    sortOrder: 3,
    presets: [
      { slug: 't1', name: 'Golden Hour', description: 'Warm glow, 30 min before sunset', basePrompt: 'Golden Hour, Warm glow, 30 min before sunset' },
      { slug: 't2', name: 'Blue Hour', description: 'Twilight, cool blue tones', basePrompt: 'Blue Hour, Twilight, cool blue tones' },
      { slug: 't3', name: 'Midday Sun', description: 'Harsh overhead, high contrast', basePrompt: 'Midday Sun, Harsh overhead, high contrast' },
      { slug: 't4', name: 'Overcast Morning', description: 'Soft diffused, no shadows', basePrompt: 'Overcast Morning, Soft diffused, no shadows' },
      { slug: 't5', name: 'Night', description: 'Artificial lighting, dark background', basePrompt: 'Night, Artificial lighting, dark background' },
      { slug: 't6', name: 'Sunrise', description: 'Pale pink & orange horizon', basePrompt: 'Sunrise, Pale pink & orange horizon' },
    ],
  },
  {
    slug: 'WEATHER',
    name: 'Weather',
    description: 'Weather conditions',
    iconName: 'cloud',
    sortOrder: 4,
    presets: [
      { slug: 'we1', name: 'Clear Sky', description: 'No clouds, vivid colors', basePrompt: 'Clear Sky, No clouds, vivid colors' },
      { slug: 'we2', name: 'Light Rain', description: 'Wet streets, soft reflections', basePrompt: 'Light Rain, Wet streets, soft reflections' },
      { slug: 'we3', name: 'Heavy Rain', description: 'Dramatic storm, rain streaks', basePrompt: 'Heavy Rain, Dramatic storm, rain streaks' },
      { slug: 'we4', name: 'Light Snow', description: 'Snowflakes, winter mood', basePrompt: 'Light Snow, Snowflakes, winter mood' },
      { slug: 'we5', name: 'Fog / Mist', description: 'Ethereal, reduced visibility', basePrompt: 'Fog / Mist, Ethereal, reduced visibility' },
      { slug: 'we6', name: 'Windy', description: 'Hair and clothes in motion', basePrompt: 'Windy, Hair and clothes in motion' },
    ],
  },
  {
    slug: 'POSE',
    name: 'Pose',
    description: 'Subject pose and action',
    iconName: 'user',
    sortOrder: 5,
    presets: [
      { slug: 'p1', name: 'Walking Forward', description: 'Natural stride, confident', basePrompt: 'Walking Forward, Natural stride, confident' },
      { slug: 'p2', name: 'Standing Straight', description: 'Frontal, composed, editorial', basePrompt: 'Standing Straight, Frontal, composed, editorial' },
      { slug: 'p3', name: 'Sitting Casually', description: 'Relaxed seated, candid', basePrompt: 'Sitting Casually, Relaxed seated, candid' },
      { slug: 'p4', name: 'Looking Over Shoulder', description: '3/4 back view, glancing', basePrompt: 'Looking Over Shoulder, 3/4 back view, glancing' },
      { slug: 'p5', name: 'Dynamic Action', description: 'Movement blur, energetic', basePrompt: 'Dynamic Action, Movement blur, energetic' },
      { slug: 'p6', name: 'Lying Down', description: 'Horizontal, resting mood', basePrompt: 'Lying Down, Horizontal, resting mood' },
    ],
  },
  {
    slug: 'LIGHTING',
    name: 'Lighting',
    description: 'Studio or environmental lighting styles',
    iconName: 'zap',
    sortOrder: 6,
    presets: [
      { slug: 'li1', name: 'Rembrandt Lighting', description: 'Dramatic triangle shadow on cheek', basePrompt: 'Rembrandt Lighting, Dramatic triangle shadow on cheek' },
      { slug: 'li2', name: 'Butterfly Lighting', description: 'Overhead, glamour shadow under nose', basePrompt: 'Butterfly Lighting, Overhead, glamour shadow under nose' },
      { slug: 'li3', name: 'Rim / Backlight', description: 'Edge glow, silhouette definition', basePrompt: 'Rim / Backlight, Edge glow, silhouette definition' },
      { slug: 'li4', name: 'Natural Window', description: 'Soft side lighting, realistic', basePrompt: 'Natural Window, Soft side lighting, realistic' },
      { slug: 'li5', name: 'Neon RGB', description: 'Cyberpunk multi-color gels', basePrompt: 'Neon RGB, Cyberpunk multi-color gels' },
      { slug: 'li6', name: 'Cinematic Moody', description: 'Low-key, deep shadows, atmosphere', basePrompt: 'Cinematic Moody, Low-key, deep shadows, atmosphere' },
    ],
  },
  {
    slug: 'CAMERA',
    name: 'Camera',
    description: 'Lens and camera settings',
    iconName: 'camera',
    sortOrder: 7,
    presets: [
      { slug: 'c1', name: '85mm Portrait', description: 'f/1.4, shallow DOF, creamy bokeh', basePrompt: '85mm Portrait lens, f/1.4, shallow depth of field, creamy bokeh' },
      { slug: 'c2', name: '35mm Street', description: 'f/8, everything in focus, wide', basePrompt: '35mm Street photography lens, f/8, everything in focus, wide angle' },
      { slug: 'c3', name: '50mm Standard', description: 'Natural perspective, versatile', basePrompt: '50mm Standard lens, Natural perspective' },
      { slug: 'c4', name: '24mm Wide Angle', description: 'Environmental, dramatic foreground', basePrompt: '24mm Wide Angle lens, Environmental, dramatic foreground' },
      { slug: 'c5', name: '200mm Telephoto', description: 'Compressed background, isolated subject', basePrompt: '200mm Telephoto lens, Compressed background, isolated subject' },
      { slug: 'c6', name: 'Macro Close-up', description: 'Extreme detail, texture focus', basePrompt: 'Macro Close-up photography, Extreme detail, texture focus' },
    ],
  },
];

async function main() {
  console.log('Seeding initial data...');

  // 1. Create Default Workspace
  const defaultWorkspace = await prisma.workspace.upsert({
    where: { slug: 'default-workspace' },
    update: {},
    create: {
      name: 'Default Workspace',
      slug: 'default-workspace',
    },
  });

  // 2. Iterate and create categories and presets
  for (const moduleData of MODULES) {
    const category = await prisma.category.upsert({
      where: { slug: moduleData.slug },
      update: {
        name: moduleData.name,
        icon: moduleData.iconName,
        sortOrder: moduleData.sortOrder,
      },
      create: {
        slug: moduleData.slug,
        name: moduleData.name,
        icon: moduleData.iconName,
        sortOrder: moduleData.sortOrder,
      },
    });

    let presetSort = 1;
    for (const preset of moduleData.presets) {
      await prisma.preset.upsert({
        where: { slug: preset.slug },
        update: {
          name: preset.name,
          description: preset.description,
          promptChunk: preset.basePrompt,
          sortOrder: presetSort,
        },
        create: {
          categoryId: category.id,
          slug: preset.slug,
          name: preset.name,
          description: preset.description,
          promptChunk: preset.basePrompt,
          sortOrder: presetSort,
          isActive: true,
        },
      });
      presetSort++;
    }
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
