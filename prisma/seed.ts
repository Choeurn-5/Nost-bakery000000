import {
  PrismaClient,
  Role,
  ContentStatus,
  Availability,
  ChannelTag,
  ProductBadge,
  StoryLayout,
  GalleryType,
} from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting NOST Bakery database seed...');

  // ============================================
  // 1. Users (Owner & Editor)
  // ============================================
  console.log('👤 Seeding users...');
  const ownerHashedPassword = await hash('nost2024!', 10);
  const editorHashedPassword = await hash('editor2024!', 10);

  const owner = await prisma.user.upsert({
    where: { email: 'owner@nostbakery.com' },
    update: {
      name: 'NOST Owner',
      hashedPassword: ownerHashedPassword,
      role: Role.OWNER,
      active: true,
    },
    create: {
      name: 'NOST Owner',
      email: 'owner@nostbakery.com',
      hashedPassword: ownerHashedPassword,
      role: Role.OWNER,
      active: true,
    },
  });
  console.log(`  ✓ Owner user verified: ${owner.email}`);

  const editor = await prisma.user.upsert({
    where: { email: 'editor@nostbakery.com' },
    update: {
      name: 'NOST Editor',
      hashedPassword: editorHashedPassword,
      role: Role.EDITOR,
      active: true,
    },
    create: {
      name: 'NOST Editor',
      email: 'editor@nostbakery.com',
      hashedPassword: editorHashedPassword,
      role: Role.EDITOR,
      active: true,
    },
  });
  console.log(`  ✓ Editor user verified: ${editor.email}`);

  // ============================================
  // 2. Site Settings (id: 'default')
  // ============================================
  console.log('⚙️ Seeding site settings...');
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    update: {
      phoneNumbers: ['060 731 888', '099 200 076'],
      email: 'info@nostbakery.com',
      telegramLink: 'https://t.me/NostBakery',
      facebookLink: 'https://www.facebook.com/NOSTBakeryPastry',
      websiteUrl: 'nostbakery.com',
      addressEn: 'Angkor Mansion & Residence, Siem Reap, Cambodia',
      addressKm: 'អង់គរ ម៉េនសិន & រេស៊ីដិនស៍, សៀមរាប, កម្ពុជា',
      seoTitleEn: 'NOST Bakery & Pastry — Fresh Bakery in Siem Reap, Cambodia',
      seoTitleKm: 'NOST Bakery & Pastry — នំប៉័ង និង នំផេស្ត្រី ស្រស់ៗ នៅសៀមរាប',
      seoDescriptionEn:
        'Fresh bread, pastries, cakes and desserts in Siem Reap, Cambodia. Café, takeaway and wholesale frozen bakery supply.',
      seoDescriptionKm:
        'នំប៉័ង នំផេស្ត្រី នំខេក និងបង្អែមស្រស់ៗរៀងរាល់ថ្ងៃនៅសៀមរាប។ មានកាហ្វេ វេចខ្ចប់ និងផ្គត់ផ្គង់នំប៉័ងក្លាស្សេលក់ដុំ។',
      cookieNoticeTextEn:
        'We use cookies to improve your experience. By continuing, you agree to our use of cookies.',
      cookieNoticeTextKm:
        'យើងប្រើប្រាស់ cookies ដើម្បីកែលម្អបទពិសោធន៍របស់អ្នក។ ដោយបន្តប្រើប្រាស់ អ្នកយល់ព្រមនឹងការប្រើប្រាស់ cookies របស់យើង។',
      footerTextEn: 'Baked with love in Siem Reap.',
      footerTextKm: 'ដុតនំដោយក្តីស្រឡាញ់នៅសៀមរាប។',
    },
    create: {
      id: 'default',
      phoneNumbers: ['060 731 888', '099 200 076'],
      email: 'info@nostbakery.com',
      telegramLink: 'https://t.me/NostBakery',
      facebookLink: 'https://www.facebook.com/NOSTBakeryPastry',
      websiteUrl: 'nostbakery.com',
      addressEn: 'Angkor Mansion & Residence, Siem Reap, Cambodia',
      addressKm: 'អង់គរ ម៉េនសិន & រេស៊ីដិនស៍, សៀមរាប, កម្ពុជា',
      seoTitleEn: 'NOST Bakery & Pastry — Fresh Bakery in Siem Reap, Cambodia',
      seoTitleKm: 'NOST Bakery & Pastry — នំប៉័ង និង នំផេស្ត្រី ស្រស់ៗ នៅសៀមរាប',
      seoDescriptionEn:
        'Fresh bread, pastries, cakes and desserts in Siem Reap, Cambodia. Café, takeaway and wholesale frozen bakery supply.',
      seoDescriptionKm:
        'នំប៉័ង នំផេស្ត្រី នំខេក និងបង្អែមស្រស់ៗរៀងរាល់ថ្ងៃនៅសៀមរាប។ មានកាហ្វេ វេចខ្ចប់ និងផ្គត់ផ្គង់នំប៉័ងក្លាស្សេលក់ដុំ។',
      cookieNoticeTextEn:
        'We use cookies to improve your experience. By continuing, you agree to our use of cookies.',
      cookieNoticeTextKm:
        'យើងប្រើប្រាស់ cookies ដើម្បីកែលម្អបទពិសោធន៍របស់អ្នក។ ដោយបន្តប្រើប្រាស់ អ្នកយល់ព្រមនឹងការប្រើប្រាស់ cookies របស់យើង។',
      footerTextEn: 'Baked with love in Siem Reap.',
      footerTextKm: 'ដុតនំដោយក្តីស្រឡាញ់នៅសៀមរាប។',
    },
  });
  console.log('  ✓ Site settings configured');

  // ============================================
  // 3. Announcement Bar (id: 'default')
  // ============================================
  console.log('📢 Seeding announcement bar...');
  await prisma.announcementBar.upsert({
    where: { id: 'default' },
    update: {
      textEn: 'Buy 1 Get 1 Free · Every day 6:00 PM – 9:00 PM',
      textKm: 'ទិញ ១ ថែម ១ ឥតគិតថ្លៃ · រៀងរាល់ថ្ងៃ ម៉ោង ៦:០០ ល្ងាច – ៩:០០ យប់',
      link: '/promotions',
      isActive: true,
    },
    create: {
      id: 'default',
      textEn: 'Buy 1 Get 1 Free · Every day 6:00 PM – 9:00 PM',
      textKm: 'ទិញ ១ ថែម ១ ឥតគិតថ្លៃ · រៀងរាល់ថ្ងៃ ម៉ោង ៦:០០ ល្ងាច – ៩:០០ យប់',
      link: '/promotions',
      isActive: true,
    },
  });
  console.log('  ✓ Announcement bar configured');

  // ============================================
  // 4. Categories (6)
  // ============================================
  console.log('📂 Seeding categories...');
  const categoryData = [
    {
      slug: 'croissants-pastries',
      nameEn: 'Croissants & Pastries',
      nameKm: 'ក្រូសង់ និង នំផេស្ត្រី',
      image:
        'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
      imageAltEn: 'Freshly baked French croissants and pastries',
      imageAltKm: 'ក្រូសង់ និងនំផេស្ត្រីដុតថ្មីៗ',
      isVisible: true,
      sortOrder: 1,
    },
    {
      slug: 'breads',
      nameEn: 'Breads',
      nameKm: 'នំប៉័ង',
      image:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
      imageAltEn: 'Rustic sourdough loaves and French baguettes',
      imageAltKm: 'នំប៉័ងសួរដូ និងបាហ្គែតស្រស់ៗ',
      isVisible: true,
      sortOrder: 2,
    },
    {
      slug: 'cakes',
      nameEn: 'Cakes',
      nameKm: 'នំខេក',
      image:
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
      imageAltEn: 'Celebration cakes and gourmet dessert slices',
      imageAltKm: 'នំខេកខួបកំណើត និងនំខេកកាត់ដុំ',
      isVisible: true,
      sortOrder: 3,
    },
    {
      slug: 'desserts-tiramisu',
      nameEn: 'Desserts & Tiramisu',
      nameKm: 'បង្អែម និង ទីរ៉ាមីស៊ូ',
      image:
        'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
      imageAltEn: 'Authentic Italian tiramisu and chilled specialties',
      imageAltKm: 'ទីរ៉ាមីស៊ូអ៊ីតាលី និងបង្អែមត្រជាក់ៗ',
      isVisible: true,
      sortOrder: 4,
    },
    {
      slug: 'drinks',
      nameEn: 'Drinks',
      nameKm: 'ភេសជ្ជៈ',
      image:
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      imageAltEn: 'Barista specialty espresso and cold craft drinks',
      imageAltKm: 'កាហ្វេ espresso ឡាតេ និងភេសជ្ជៈត្រជាក់',
      isVisible: true,
      sortOrder: 5,
    },
    {
      slug: 'frozen-bakery',
      nameEn: 'Frozen Bakery',
      nameKm: 'នំប៉័ងក្លាស្សេ',
      image:
        'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&w=800&q=80',
      imageAltEn: 'Raw frozen croissants and ready-to-bake wholesale goods',
      imageAltKm: 'ក្រូសង់ក្លាស្សេឆៅ និងនំសម្រាប់ដុតលក់ដុំ',
      isVisible: true,
      sortOrder: 6,
    },
  ];

  const categoriesBySlug: Record<string, string> = {};
  for (const cat of categoryData) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        nameEn: cat.nameEn,
        nameKm: cat.nameKm,
        image: cat.image,
        imageAltEn: cat.imageAltEn,
        imageAltKm: cat.imageAltKm,
        isVisible: cat.isVisible,
        sortOrder: cat.sortOrder,
      },
      create: cat,
    });
    categoriesBySlug[cat.slug] = record.id;
  }
  console.log(`  ✓ 6 Categories seeded`);

  // ============================================
  // 5. Products & Product Images (14)
  // ============================================
  console.log('🥐 Seeding products...');
  const productsData = [
    {
      nameEn: 'Classic Butter Croissant',
      nameKm: 'ក្រូសង់ប៊ឺរបារាំងបុរាណ',
      slug: 'classic-butter-croissant',
      descriptionEn:
        'Flaky, golden-brown French butter croissant layered with rich Normandy-style butter and baked fresh daily.',
      descriptionKm: 'ក្រូសង់ប៊ឺរបារាំងស្រួយស្រទាប់ ឈ្ងុយឆ្ងាញ់ ដុតថ្មីៗជារៀងរាល់ថ្ងៃ។',
      price: 2.5,
      categorySlug: 'croissants-pastries',
      badges: [ProductBadge.BEST_SELLER, ProductBadge.FEATURED],
      availability: Availability.AVAILABLE,
      channelTags: [ChannelTag.RETAIL],
      isFeatured: true,
      sortOrder: 1,
      status: ContentStatus.PUBLISHED,
      image:
        'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1000&q=80',
      imageAltEn: 'Golden, crispy classic French butter croissant',
      imageAltKm: 'ក្រូសង់ប៊ឺរបារាំងស្រទាប់ស្រួយពណ៌មាស',
    },
    {
      nameEn: 'Pain au Chocolat',
      nameKm: 'នំផេនអូសូកូឡា',
      slug: 'pain-au-chocolat',
      descriptionEn:
        'Laminated croissant dough wrapped around two batons of rich dark chocolate, baked to crispy perfection.',
      descriptionKm: 'នំផេស្ត្រីស្រទាប់ស្រួយរុំជាមួយសូកូឡាខ្មៅពីរដើម ដុតយ៉ាងឈ្ងុយឆ្ងាញ់។',
      price: 3.0,
      categorySlug: 'croissants-pastries',
      badges: [ProductBadge.FEATURED],
      availability: Availability.AVAILABLE,
      channelTags: [ChannelTag.RETAIL],
      isFeatured: true,
      sortOrder: 2,
      status: ContentStatus.PUBLISHED,
      image:
        'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&w=1000&q=80',
      imageAltEn: 'Flaky Pain au Chocolat with dark chocolate filling',
      imageAltKm: 'នំផេនអូសូកូឡាស្រទាប់ស្រួយ',
    },
    {
      nameEn: 'Almond Croissant',
      nameKm: 'ក្រូសង់អាល់ម៉ុន',
      slug: 'almond-croissant',
      descriptionEn:
        'Twice-baked croissant filled with rich almond frangipane cream and topped with toasted sliced almonds and powdered sugar.',
      descriptionKm:
        'ក្រូសង់ដុតពីរដង បំពេញដោយក្រែមអាល់ម៉ុន ស្រោបដោយបន្ទះអាល់ម៉ុនលីង និងម្សៅស្ករ។',
      price: 3.5,
      categorySlug: 'croissants-pastries',
      badges: [ProductBadge.NEW],
      availability: Availability.AVAILABLE,
      channelTags: [ChannelTag.RETAIL],
      isFeatured: false,
      sortOrder: 3,
      status: ContentStatus.PUBLISHED,
      image:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
      imageAltEn: 'Toasted almond croissant with frangipane cream',
      imageAltKm: 'ក្រូសង់អាល់ម៉ុនដុតពីរដងជាមួយក្រែមអាល់ម៉ុន',
    },
    {
      nameEn: 'Durian Cream Cake',
      nameKm: 'នំខេកសាច់ទុរេនកំពត',
      slug: 'durian-cream-cake',
      descriptionEn:
        'Light and airy chiffon sponge infused with premium Kampot durian puree and velvety fresh cream.',
      descriptionKm: 'នំខេកស្ពោតស្រាល បំពេញដោយសាច់ទុរេនកំពតសុទ្ធ និងក្រែមស្រស់ឈ្ងុយឆ្ងាញ់។',
      price: 15.0,
      categorySlug: 'cakes',
      badges: [ProductBadge.NEW, ProductBadge.FEATURED],
      availability: Availability.AVAILABLE,
      channelTags: [ChannelTag.RETAIL],
      isFeatured: true,
      sortOrder: 4,
      status: ContentStatus.PUBLISHED,
      image:
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80',
      imageAltEn: 'Specialty Durian Cream Cake made with fresh Kampot durian',
      imageAltKm: 'នំខេកសាច់ទុរេនកំពតពិសេសរសជាតិឈ្ងុយឆ្ងាញ់',
    },
    {
      nameEn: 'Classic Tiramisu',
      nameKm: 'ទីរ៉ាមីស៊ូបុរាណ',
      slug: 'classic-tiramisu',
      descriptionEn:
        'Traditional Italian tiramisu layered with espresso-soaked savoiardi ladyfingers and creamy mascarpone sabayon.',
      descriptionKm:
        'ទីរ៉ាមីស៊ូបែបអ៊ីតាលីប្រពៃណី ផ្សំជាមួយនំស្រួយជ្រលក់កាហ្វេ espresso និងក្រែម mascarpone។',
      price: 5.5,
      categorySlug: 'desserts-tiramisu',
      badges: [ProductBadge.BEST_SELLER, ProductBadge.FEATURED],
      availability: Availability.AVAILABLE,
      channelTags: [ChannelTag.RETAIL],
      isFeatured: true,
      sortOrder: 5,
      status: ContentStatus.PUBLISHED,
      image:
        'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=1000&q=80',
      imageAltEn: 'Decadent Italian tiramisu topped with cocoa powder',
      imageAltKm: 'ទីរ៉ាមីស៊ូអ៊ីតាលីស្រោបដោយម្សៅកាកាវ',
    },
    {
      nameEn: 'Sourdough Bread',
      nameKm: 'នំប៉័ងសួរដូធម្មជាតិ',
      slug: 'sourdough-bread',
      descriptionEn:
        'Naturally fermented artisanal sourdough with a blistered crunchy crust and an open, chewy crumb.',
      descriptionKm: 'នំប៉័ងសួរដូធ្វើដោយដៃ ផ្អាប់ដោយមេធម្មជាតិ សំបកស្រួយ និងទន់ស្វិតខាងក្នុង។',
      price: 4.0,
      categorySlug: 'breads',
      badges: [],
      availability: Availability.AVAILABLE,
      channelTags: [ChannelTag.RETAIL],
      isFeatured: false,
      sortOrder: 6,
      status: ContentStatus.PUBLISHED,
      image:
        'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=1000&q=80',
      imageAltEn: 'Crusty rustic sourdough loaf',
      imageAltKm: 'នំប៉័ងសួរដូធម្មជាតិសំបកស្រួយ',
    },
    {
      nameEn: 'Baguette',
      nameKm: 'នំប៉័ងបាហ្គែតបារាំង',
      slug: 'baguette',
      descriptionEn:
        'Classic French baguette with crisp golden crust and honeycomb aeration, baked several times a day.',
      descriptionKm:
        'បាហ្គែតបារាំងបុរាណ សំបកស្រួយពណ៌មាស និងសាច់នំទន់ស្ពោត ដុតច្រើនដងក្នុងមួយថ្ងៃ។',
      price: 2.0,
      categorySlug: 'breads',
      badges: [ProductBadge.FEATURED],
      availability: Availability.AVAILABLE,
      channelTags: [ChannelTag.RETAIL],
      isFeatured: true,
      sortOrder: 7,
      status: ContentStatus.PUBLISHED,
      image:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
      imageAltEn: 'Traditional crispy French baguette',
      imageAltKm: 'បាហ្គែតបារាំងស្រួយពណ៌មាស',
    },
    {
      nameEn: 'Red Velvet Cake',
      nameKm: 'នំខេក Red Velvet',
      slug: 'red-velvet-cake',
      descriptionEn: 'Decadent cocoa-scented crimson cake layered with tangy cream cheese frosting.',
      descriptionKm: 'នំខេកក្រហមក្រលៃរសជាតិកាកាវ ញាំជាមួយក្រែមឈីសទន់ល្មើយ។',
      price: 18.0,
      categorySlug: 'cakes',
      badges: [],
      availability: Availability.AVAILABLE,
      channelTags: [ChannelTag.RETAIL],
      isFeatured: false,
      sortOrder: 8,
      status: ContentStatus.PUBLISHED,
      image:
        'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&w=1000&q=80',
      imageAltEn: 'Rich Red Velvet celebration cake with cream cheese swirl',
      imageAltKm: 'នំខេក Red Velvet ជាមួយក្រែមឈីស',
    },
    {
      nameEn: 'Iced Latte',
      nameKm: 'កាហ្វេឡាតេទឹកកក',
      slug: 'iced-latte',
      descriptionEn: 'Double shot of rich espresso poured over chilled fresh milk and served over ice.',
      descriptionKm: 'កាហ្វេ espresso ពីរផ្លោះ ផ្សំជាមួយទឹកដោះគោស្រស់ត្រជាក់ និងទឹកកក។',
      price: 3.5,
      categorySlug: 'drinks',
      badges: [],
      availability: Availability.AVAILABLE,
      channelTags: [ChannelTag.RETAIL],
      isFeatured: false,
      sortOrder: 9,
      status: ContentStatus.PUBLISHED,
      image:
        'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1000&q=80',
      imageAltEn: 'Chilled iced latte with fresh milk layering',
      imageAltKm: 'កាហ្វេឡាតេទឹកកកជាមួយទឹកដោះគោស្រស់',
    },
    {
      nameEn: 'Cappuccino',
      nameKm: 'កាហ្វេកាពូឈីណូ',
      slug: 'cappuccino',
      descriptionEn:
        'Equal parts bold espresso, steamed milk, and velvety milk foam dusted with cocoa powder.',
      descriptionKm: 'កាហ្វេ espresso ជាមួយទឹកដោះគោក្តៅ និងពពុះទឹកដោះគោទន់រលោង។',
      price: 3.0,
      categorySlug: 'drinks',
      badges: [],
      availability: Availability.AVAILABLE,
      channelTags: [ChannelTag.RETAIL],
      isFeatured: false,
      sortOrder: 10,
      status: ContentStatus.PUBLISHED,
      image:
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80',
      imageAltEn: 'Hot cappuccino with rich velvety froth',
      imageAltKm: 'កាពូឈីណូក្តៅជាមួយពពុះទឹកដោះគោ',
    },
    {
      nameEn: 'Frozen Raw Croissant (Small, 30pcs)',
      nameKm: 'ក្រូសង់តូចក្លាស្សេឆៅ (៣០ ដុំ)',
      slug: 'frozen-raw-croissant-small-30pcs',
      descriptionEn:
        'Ready-to-proof raw frozen mini croissants made with European butter. Pack of 30 pieces for cafés and hotels.',
      descriptionKm: 'ក្រូសង់តូចក្លាស្សេឆៅ ងាយស្រួលផ្អាប់ដុត ធ្វើពីប៊ឺអឺរ៉ុប (កញ្ចប់ ៣០ ដុំ)។',
      price: null,
      categorySlug: 'frozen-bakery',
      badges: [ProductBadge.FEATURED],
      availability: Availability.AVAILABLE,
      channelTags: [ChannelTag.WHOLESALE, ChannelTag.FROZEN],
      isFeatured: true,
      sortOrder: 11,
      status: ContentStatus.PUBLISHED,
      image:
        'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1000&q=80',
      imageAltEn: 'Raw frozen mini croissants for wholesale baking',
      imageAltKm: 'ក្រូសង់តូចក្លាស្សេឆៅសម្រាប់ដុតលក់ដុំ',
    },
    {
      nameEn: 'Frozen Raw Croissant (Large, 20pcs)',
      nameKm: 'ក្រូសង់ធំក្លាស្សេឆៅ (២០ ដុំ)',
      slug: 'frozen-raw-croissant-large-20pcs',
      descriptionEn:
        'Standard French bakery size raw frozen butter croissants for cafes and hotels. Pack of 20 pieces.',
      descriptionKm: 'ក្រូសង់ធំក្លាស្សេឆៅខ្នាតស្តង់ដារ សម្រាប់ហាងកាហ្វេ និងសណ្ឋាគារ (កញ្ចប់ ២០ ដុំ)។',
      price: null,
      categorySlug: 'frozen-bakery',
      badges: [],
      availability: Availability.AVAILABLE,
      channelTags: [ChannelTag.WHOLESALE, ChannelTag.FROZEN],
      isFeatured: false,
      sortOrder: 12,
      status: ContentStatus.PUBLISHED,
      image:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
      imageAltEn: 'Standard size frozen butter croissants in wholesale carton',
      imageAltKm: 'ក្រូសង់ធំក្លាស្សេឆៅសម្រាប់លក់ដុំ',
    },
    {
      nameEn: 'Frozen Pain au Chocolat (25pcs)',
      nameKm: 'ផេនអូសូកូឡាក្លាស្សេឆៅ (២៥ ដុំ)',
      slug: 'frozen-pain-au-chocolat-25pcs',
      descriptionEn:
        'Pre-formed raw frozen chocolate croissants with dual chocolate bars. Pack of 25 pieces.',
      descriptionKm: 'ផេនអូសូកូឡាក្លាស្សេឆៅ ជាមួយសូកូឡាពីរដើម (កញ្ចប់ ២៥ ដុំ)។',
      price: null,
      categorySlug: 'frozen-bakery',
      badges: [],
      availability: Availability.AVAILABLE,
      channelTags: [ChannelTag.WHOLESALE, ChannelTag.FROZEN],
      isFeatured: false,
      sortOrder: 13,
      status: ContentStatus.PUBLISHED,
      image:
        'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&w=1000&q=80',
      imageAltEn: 'Raw frozen Pain au Chocolat wholesale pack',
      imageAltKm: 'ផេនអូសូកូឡាក្លាស្សេឆៅសម្រាប់លក់ដុំ',
    },
    {
      nameEn: 'Mango Cheesecake',
      nameKm: 'ឈីសខេកស្វាយកែវរមៀត',
      slug: 'mango-cheesecake',
      descriptionEn:
        'Velvety New York style baked cheesecake topped with fresh Cambodian Keo Romeat mango compote.',
      descriptionKm: 'ឈីសខេកដុតបែបញូវយ៉ក ស្រោបដោយដំណាប់ស្វាយកែវរមៀតខ្មែរស្រស់ៗ។',
      price: 16.0,
      categorySlug: 'cakes',
      badges: [ProductBadge.SEASONAL],
      availability: Availability.AVAILABLE,
      channelTags: [ChannelTag.RETAIL],
      isFeatured: false,
      sortOrder: 14,
      status: ContentStatus.PUBLISHED,
      image:
        'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1000&q=80',
      imageAltEn: 'Luscious seasonal Mango Cheesecake slice',
      imageAltKm: 'ឈីសខេកស្វាយកែវរមៀតស្រស់ៗ',
    },
  ];

  const productsBySlug: Record<string, string> = {};
  for (const item of productsData) {
    const categoryId = categoriesBySlug[item.categorySlug];
    if (!categoryId) {
      console.warn(`Category slug not found: ${item.categorySlug}`);
      continue;
    }

    const product = await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        nameEn: item.nameEn,
        nameKm: item.nameKm,
        descriptionEn: item.descriptionEn,
        descriptionKm: item.descriptionKm,
        price: item.price,
        categoryId,
        badges: item.badges,
        availability: item.availability,
        channelTags: item.channelTags,
        isFeatured: item.isFeatured,
        sortOrder: item.sortOrder,
        status: item.status,
        publishedAt: new Date(),
      },
      create: {
        nameEn: item.nameEn,
        nameKm: item.nameKm,
        slug: item.slug,
        descriptionEn: item.descriptionEn,
        descriptionKm: item.descriptionKm,
        price: item.price,
        categoryId,
        badges: item.badges,
        availability: item.availability,
        channelTags: item.channelTags,
        isFeatured: item.isFeatured,
        sortOrder: item.sortOrder,
        status: item.status,
        publishedAt: new Date(),
      },
    });

    productsBySlug[item.slug] = product.id;

    // Seed primary product image
    const existingImages = await prisma.productImage.findMany({
      where: { productId: product.id },
    });
    if (existingImages.length === 0) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: item.image,
          altEn: item.imageAltEn,
          altKm: item.imageAltKm,
          sortOrder: 0,
        },
      });
    }
  }
  console.log(`  ✓ 14 Products seeded with images`);

  // ============================================
  // 6. Promotions (2) & PromotionProducts
  // ============================================
  console.log('🏷️ Seeding promotions...');
  const bogoPromo = await prisma.promotion.upsert({
    where: { id: 'promo-bogo' },
    update: {
      titleEn: 'Buy 1 Get 1 Free',
      titleKm: 'ទិញ ១ ថែម ១ ឥតគិតថ្លៃ',
      badgeTextEn: 'BOGO',
      badgeTextKm: 'ទិញ១ថែម១',
      descriptionEn:
        'Enjoy Buy 1 Get 1 Free on all fresh artisan pastries every evening from 6:00 PM to 9:00 PM.',
      descriptionKm:
        'រីករាយជាមួយការផ្តល់ជូនទិញ ១ ថែម ១ លើនំផេស្ត្រីស្រស់ៗទាំងអស់រៀងរាល់ល្ងាច ចាប់ពីម៉ោង ៦:០០ ល្ងាច ដល់ ៩:០០ យប់។',
      finePrintEn:
        'Valid for in-store takeaway on selected fresh pastries while daily batches last.',
      finePrintKm:
        'មានសុពលភាពសម្រាប់ការទិញវេចខ្ចប់នៅហាងលើនំផេស្ត្រីដែលបានកំណត់ រហូតដល់អស់ពីស្តុក។',
      dailyStartTime: '18:00',
      dailyEndTime: '21:00',
      showOnHome: true,
      status: ContentStatus.PUBLISHED,
      image:
        'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80',
      imageAltEn: 'Evening Buy 1 Get 1 Free pastry promotion at NOST Bakery',
      imageAltKm: 'ប្រូម៉ូសិនទិញ ១ ថែម ១ ពេលល្ងាចនៅ NOST Bakery',
    },
    create: {
      id: 'promo-bogo',
      titleEn: 'Buy 1 Get 1 Free',
      titleKm: 'ទិញ ១ ថែម ១ ឥតគិតថ្លៃ',
      badgeTextEn: 'BOGO',
      badgeTextKm: 'ទិញ១ថែម១',
      descriptionEn:
        'Enjoy Buy 1 Get 1 Free on all fresh artisan pastries every evening from 6:00 PM to 9:00 PM.',
      descriptionKm:
        'រីករាយជាមួយការផ្តល់ជូនទិញ ១ ថែម ១ លើនំផេស្ត្រីស្រស់ៗទាំងអស់រៀងរាល់ល្ងាច ចាប់ពីម៉ោង ៦:០០ ល្ងាច ដល់ ៩:០០ យប់។',
      finePrintEn:
        'Valid for in-store takeaway on selected fresh pastries while daily batches last.',
      finePrintKm:
        'មានសុពលភាពសម្រាប់ការទិញវេចខ្ចប់នៅហាងលើនំផេស្ត្រីដែលបានកំណត់ រហូតដល់អស់ពីស្តុក។',
      dailyStartTime: '18:00',
      dailyEndTime: '21:00',
      showOnHome: true,
      status: ContentStatus.PUBLISHED,
      image:
        'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80',
      imageAltEn: 'Evening Buy 1 Get 1 Free pastry promotion at NOST Bakery',
      imageAltKm: 'ប្រូម៉ូសិនទិញ ១ ថែម ១ ពេលល្ងាចនៅ NOST Bakery',
    },
  });

  const durianPromo = await prisma.promotion.upsert({
    where: { id: 'promo-durian-launch' },
    update: {
      titleEn: 'New Flavour Launch — Durian Cream Cake',
      titleKm: 'ការសម្ពោធរសជាតិថ្មី — នំខេកសាច់ទុរេន',
      badgeTextEn: 'NEW',
      badgeTextKm: 'ថ្មី',
      descriptionEn:
        'Introducing our signature Durian Cream Cake, crafted with authentic Kampot durian and delicate fresh whipped cream.',
      descriptionKm:
        'សូមណែនាំនំខេកសាច់ទុរេនពិសេសរបស់យើង ធ្វើឡើងពីទុរេនកំពតសុទ្ធ និងក្រែមស្រស់ទន់ល្មើយ។',
      finePrintEn: 'Available daily by the slice and for advance whole-cake pre-orders.',
      finePrintKm: 'មានលក់រៀងរាល់ថ្ងៃជាដុំ និងទទួលការកុម្ម៉ង់នំខេកទាំងមូលទុកជាមុន។',
      showOnHome: true,
      status: ContentStatus.PUBLISHED,
      image:
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80',
      imageAltEn: 'Durian Cream Cake special launch',
      imageAltKm: 'ការសម្ពោធនំខេកសាច់ទុរេនថ្មី',
    },
    create: {
      id: 'promo-durian-launch',
      titleEn: 'New Flavour Launch — Durian Cream Cake',
      titleKm: 'ការសម្ពោធរសជាតិថ្មី — នំខេកសាច់ទុរេន',
      badgeTextEn: 'NEW',
      badgeTextKm: 'ថ្មី',
      descriptionEn:
        'Introducing our signature Durian Cream Cake, crafted with authentic Kampot durian and delicate fresh whipped cream.',
      descriptionKm:
        'សូមណែនាំនំខេកសាច់ទុរេនពិសេសរបស់យើង ធ្វើឡើងពីទុរេនកំពតសុទ្ធ និងក្រែមស្រស់ទន់ល្មើយ។',
      finePrintEn: 'Available daily by the slice and for advance whole-cake pre-orders.',
      finePrintKm: 'មានលក់រៀងរាល់ថ្ងៃជាដុំ និងទទួលការកុម្ម៉ង់នំខេកទាំងមូលទុកជាមុន។',
      showOnHome: true,
      status: ContentStatus.PUBLISHED,
      image:
        'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80',
      imageAltEn: 'Durian Cream Cake special launch',
      imageAltKm: 'ការសម្ពោធនំខេកសាច់ទុរេនថ្មី',
    },
  });

  // Link products to promotions
  const bogoSlugs = ['classic-butter-croissant', 'pain-au-chocolat', 'almond-croissant'];
  for (const slug of bogoSlugs) {
    const prodId = productsBySlug[slug];
    if (prodId) {
      await prisma.promotionProduct.upsert({
        where: {
          promotionId_productId: {
            promotionId: bogoPromo.id,
            productId: prodId,
          },
        },
        update: {},
        create: {
          promotionId: bogoPromo.id,
          productId: prodId,
        },
      });
    }
  }

  const durianId = productsBySlug['durian-cream-cake'];
  if (durianId) {
    await prisma.promotionProduct.upsert({
      where: {
        promotionId_productId: {
          promotionId: durianPromo.id,
          productId: durianId,
        },
      },
      update: {},
      create: {
        promotionId: durianPromo.id,
        productId: durianId,
      },
    });
  }
  console.log('  ✓ 2 Promotions configured');

  // ============================================
  // 7. Wholesale Settings (id: 'default')
  // ============================================
  console.log('📦 Seeding wholesale settings...');
  await prisma.wholesaleSettings.upsert({
    where: { id: 'default' },
    update: {
      heroHeadlineEn: 'Bakery Supplies for Your Business',
      heroHeadlineKm: 'ការផ្គត់ផ្គង់នំប៉័ងសម្រាប់អាជីវកម្មរបស់អ្នក',
      heroSubHeadlineEn:
        'Consistent quality frozen and ready-to-bake products for hotels, cafés and restaurants.',
      heroSubHeadlineKm:
        'ផលិតផលក្លាស្សេ និងនំសម្រាប់ដុតដែលមានគុណភាពខ្ពស់ជាប់លាប់ សម្រាប់សណ្ឋាគារ ហាងកាហ្វេ និងភោជនីយដ្ឋាន។',
      heroImage:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=80',
      deliveryCoverageEn:
        'Siem Reap City and expanding routes across Cambodia with temperature-controlled cold chain logistics.',
      deliveryCoverageKm:
        'ក្រុងសៀមរាប និងពង្រីកផ្លូវដឹកជញ្ជូនទូទាំងប្រទេសកម្ពុជា ជាមួយរថយន្តក្លាស្សេត្រជាក់ត្រឹមត្រូវ។',
      minimumOrderTextEn:
        'Flexible minimum orders for regular wholesale partners. Customized delivery schedules available.',
      minimumOrderTextKm:
        'ចំនួនបញ្ជាទិញអប្បបរមាមានភាពបត់បែនសម្រាប់ដៃគូលក់ដុំប្រចាំ។ មានកាលវិភាគដឹកជញ្ជូនតាមតម្រូវការ។',
    },
    create: {
      id: 'default',
      heroHeadlineEn: 'Bakery Supplies for Your Business',
      heroHeadlineKm: 'ការផ្គត់ផ្គង់នំប៉័ងសម្រាប់អាជីវកម្មរបស់អ្នក',
      heroSubHeadlineEn:
        'Consistent quality frozen and ready-to-bake products for hotels, cafés and restaurants.',
      heroSubHeadlineKm:
        'ផលិតផលក្លាស្សេ និងនំសម្រាប់ដុតដែលមានគុណភាពខ្ពស់ជាប់លាប់ សម្រាប់សណ្ឋាគារ ហាងកាហ្វេ និងភោជនីយដ្ឋាន។',
      heroImage:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=80',
      deliveryCoverageEn:
        'Siem Reap City and expanding routes across Cambodia with temperature-controlled cold chain logistics.',
      deliveryCoverageKm:
        'ក្រុងសៀមរាប និងពង្រីកផ្លូវដឹកជញ្ជូនទូទាំងប្រទេសកម្ពុជា ជាមួយរថយន្តក្លាស្សេត្រជាក់ត្រឹមត្រូវ។',
      minimumOrderTextEn:
        'Flexible minimum orders for regular wholesale partners. Customized delivery schedules available.',
      minimumOrderTextKm:
        'ចំនួនបញ្ជាទិញអប្បបរមាមានភាពបត់បែនសម្រាប់ដៃគូលក់ដុំប្រចាំ។ មានកាលវិភាគដឹកជញ្ជូនតាមតម្រូវការ។',
    },
  });
  console.log('  ✓ Wholesale settings configured');

  // ============================================
  // 8. Wholesale Steps (4)
  // ============================================
  console.log('📋 Seeding wholesale steps...');
  const wholesaleStepsData = [
    {
      id: 'step-enquire',
      titleEn: 'Enquire',
      titleKm: 'សាកសួរ',
      descriptionEn:
        'Tell us what you need via our simple online form or directly through our Telegram hotline.',
      descriptionKm: 'ប្រាប់យើងពីអ្វីដែលអ្នកត្រូវការតាមទម្រង់សាកសួរ ឬទាក់ទងមកយើងតាម Telegram។',
      icon: 'message-square',
      sortOrder: 1,
    },
    {
      id: 'step-choose',
      titleEn: 'Choose Products',
      titleKm: 'ជ្រើសរើសផលិតផល',
      descriptionEn:
        'Select from our frozen croissants, baguettes, and ready-to-bake items tailored to your volume.',
      descriptionKm:
        'ជ្រើសរើសពីផលិតផលក្លាស្សេ និងនំសម្រាប់ដុតរបស់យើងដែលស័ក្តិសមសម្រាប់ហាងកាហ្វេ និងសណ្ឋាគារ។',
      icon: 'shopping-bag',
      sortOrder: 2,
    },
    {
      id: 'step-confirm',
      titleEn: 'Confirm Delivery',
      titleKm: 'បញ្ជាក់ការដឹកជញ្ជូន',
      descriptionEn:
        'We arrange dedicated cold-chain delivery directly to your kitchen on your preferred schedule.',
      descriptionKm:
        'យើងរៀបចំកាលវិភាគដឹកជញ្ជូនក្លាស្សេត្រជាក់ត្រឹមត្រូវទៅដល់ផ្ទះបាយរបស់អ្នកតាមការកំណត់។',
      icon: 'truck',
      sortOrder: 3,
    },
    {
      id: 'step-receive',
      titleEn: 'Receive',
      titleKm: 'ទទួល និងដុតនំ',
      descriptionEn:
        'Receive fresh-frozen products at your door, ready to proof and bake fresh for your guests.',
      descriptionKm:
        'ទទួលផលិតផលក្លាស្សេស្រស់ៗដល់មាត់ទ្វារ រួចរាល់សម្រាប់ផ្អាប់ និងដុតក្តៅៗជូនភ្ញៀវ។',
      icon: 'sparkles',
      sortOrder: 4,
    },
  ];

  for (const step of wholesaleStepsData) {
    await prisma.wholesaleStep.upsert({
      where: { id: step.id },
      update: step,
      create: step,
    });
  }
  console.log('  ✓ 4 Wholesale steps configured');

  // ============================================
  // 9. FAQ Items (4)
  // ============================================
  console.log('❓ Seeding FAQ items...');
  const faqs = [
    {
      id: 'faq-moq',
      questionEn: 'What is the minimum order?',
      questionKm: 'តើការបញ្ជាទិញអប្បបរមាជាអ្វី?',
      answerEn:
        "We're flexible! Small sample orders start from 2 cartons so you can test product fit and baking ease before scaling regular shipments.",
      answerKm:
        'យើងមានភាពបត់បែនខ្ពស់! ការកុម្ម៉ង់សាកល្បងចាប់ផ្តើមពីត្រឹមតែ ២ កេសប៉ុណ្ណោះ ដើម្បីឱ្យអ្នកសាកល្បងដុត និងទទួលមតិពីអតិថិជន។',
      section: 'wholesale',
      sortOrder: 1,
      isVisible: true,
    },
    {
      id: 'faq-delivery',
      questionEn: 'Where do you deliver?',
      questionKm: 'តើអ្នកដឹកជញ្ជូនទៅទីណាខ្លះ?',
      answerEn:
        'Currently we deliver daily across Siem Reap city. We also arrange regular cold-chain shipments to Phnom Penh and Battambang.',
      answerKm:
        'បច្ចុប្បន្នយើងដឹកជញ្ជូនជារៀងរាល់ថ្ងៃក្នុងក្រុងសៀមរាប។ យើងក៏រៀបចំការដឹកជញ្ជូនក្លាស្សេទៅកាន់រាជធានីភ្នំពេញ និងខេត្តបាត់ដំបងផងដែរ។',
      section: 'wholesale',
      sortOrder: 2,
      isVisible: true,
    },
    {
      id: 'faq-lead-time',
      questionEn: 'What is the lead time?',
      questionKm: 'តើរយៈពេលរង់ចាំសម្រាប់ការបញ្ជាទិញមានប៉ុន្មាន?',
      answerEn:
        'Standard wholesale orders require 2-3 business days to allow fresh preparation and rapid flash-freezing to preserve structure.',
      answerKm:
        'ការបញ្ជាទិញលក់ដុំទូទៅត្រូវការពេល ២ ទៅ ៣ ថ្ងៃនៃថ្ងៃធ្វើការ ដើម្បីធានាបាននូវការផលិតថ្មីៗ និងការក្លាស្សេឱ្យបានត្រឹមត្រូវ។',
      section: 'wholesale',
      sortOrder: 3,
      isVisible: true,
    },
    {
      id: 'faq-storage',
      questionEn: 'How should I store and bake frozen products?',
      questionKm: 'តើខ្ញុំគួរទុកដាក់ និងដុតផលិតផលក្លាស្សេដោយរបៀបណា?',
      answerEn:
        'Keep frozen at -18°C or colder upon arrival. Defrost and proof according to our included guide, then bake in a preheated oven at 175°C for golden, flaky perfection.',
      answerKm:
        'សូមរក្សាទុកភ្លាមៗក្នុងទូទឹកកកកកនៅសីតុណ្ហភាព -១៨°C ឬត្រជាក់ជាងនេះ។ ផ្អាប់ និងដុតតាមការណែនាំដែលភ្ជាប់ជូន ដើម្បីទទួលបាននំស្រួយស្រទាប់ពណ៌មាស។',
      section: 'wholesale',
      sortOrder: 4,
      isVisible: true,
    },
  ];

  for (const faq of faqs) {
    await prisma.faqItem.upsert({
      where: { id: faq.id },
      update: faq,
      create: faq,
    });
  }
  console.log('  ✓ 4 FAQ items configured');

  // ============================================
  // 10. Location (1)
  // ============================================
  console.log('📍 Seeding cafe location...');
  await prisma.location.upsert({
    where: { id: 'loc-angkor-mansion' },
    update: {
      nameEn: 'NOST Bakery Café at Angkor Mansion & Residence',
      nameKm: 'NOST Bakery Café នៅ អង់គរ ម៉េនសិន & រេស៊ីដិនស៍',
      addressEn: 'Angkor Mansion & Residence, Siem Reap, Cambodia',
      addressKm: 'អង់គរ ម៉េនសិន & រេស៊ីដិនស៍, សៀមរាប, កម្ពុជា',
      hoursEn: 'Mon-Sun: 7:00 AM - 9:00 PM',
      hoursKm: 'ចន្ទ - អាទិត្យ: ៧:០០ ព្រឹក - ៩:០០ យប់',
      image:
        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
      imageAltEn: 'NOST Bakery Café dining room and terrace',
      imageAltKm: 'បរិយាកាសកក់ក្តៅក្នុងហាង NOST Bakery Café',
      mapEmbedUrl:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3881.9!2d103.85!3d13.36!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDIxJzM2LjAiTiAxMDPCsDUxJzAwLjAiRQ!5e0!3m2!1sen!2skh!4v1',
      directionsLink: 'https://maps.google.com/?q=Siem+Reap+Cambodia',
      services: ['Dine-in', 'Takeaway', 'Desserts & drinks'],
      sortOrder: 1,
      isVisible: true,
    },
    create: {
      id: 'loc-angkor-mansion',
      nameEn: 'NOST Bakery Café at Angkor Mansion & Residence',
      nameKm: 'NOST Bakery Café នៅ អង់គរ ម៉េនសិន & រេស៊ីដិនស៍',
      addressEn: 'Angkor Mansion & Residence, Siem Reap, Cambodia',
      addressKm: 'អង់គរ ម៉េនសិន & រេស៊ីដិនស៍, សៀមរាប, កម្ពុជា',
      hoursEn: 'Mon-Sun: 7:00 AM - 9:00 PM',
      hoursKm: 'ចន្ទ - អាទិត្យ: ៧:០០ ព្រឹក - ៩:០០ យប់',
      image:
        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
      imageAltEn: 'NOST Bakery Café dining room and terrace',
      imageAltKm: 'បរិយាកាសកក់ក្តៅក្នុងហាង NOST Bakery Café',
      mapEmbedUrl:
        'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3881.9!2d103.85!3d13.36!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDIxJzM2LjAiTiAxMDPCsDUxJzAwLjAiRQ!5e0!3m2!1sen!2skh!4v1',
      directionsLink: 'https://maps.google.com/?q=Siem+Reap+Cambodia',
      services: ['Dine-in', 'Takeaway', 'Desserts & drinks'],
      sortOrder: 1,
      isVisible: true,
    },
  });
  console.log('  ✓ 1 Café location configured');

  // ============================================
  // 11. Story Blocks (3)
  // ============================================
  console.log('📖 Seeding bakery story blocks...');
  const storyBlocksData = [
    {
      id: 'story-from-our-oven',
      headingEn: 'From Our Oven',
      headingKm: 'ពីចង្ក្រានដុតនំរបស់យើង',
      textEn:
        'Every morning before sunrise, our bakers mix, laminate, and bake using traditional European techniques. We believe great bread cannot be rushed — our doughs rest and ferment slowly to unlock deep natural flavors and an airy, balanced crumb.',
      textKm:
        'រៀងរាល់ព្រឹកព្រលឹម មុនពេលព្រះអាទិត្យរះ មេចុងភៅនំប៉័ងរបស់យើងច្របល់ ធ្វើស្រទាប់ និងដុតនំតាមបច្ចេកទេសបែបអឺរ៉ុបបុរាណ។ យើងជឿជាក់ថានំប៉័ងដ៏អស្ចារ្យមិនអាចប្រញាប់ប្រញាល់បានឡើយ គឺត្រូវទុកឱ្យមេនំប៉័ងមានពេលសម្រាក និងផ្អាប់យឺតៗដើម្បីបង្កើតរសជាតិធម្មជាតិដ៏ឈ្ងុយឆ្ងាញ់។',
      image:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
      imageAltEn: 'Fresh artisanal baguettes straight from the deck oven',
      imageAltKm: 'បាហ្គែតស្រស់ៗចេញពីឡដុត',
      layout: StoryLayout.IMAGE_LEFT,
      sortOrder: 1,
      isVisible: true,
    },
    {
      id: 'story-real-ingredients',
      headingEn: 'Real Ingredients',
      headingKm: 'គ្រឿងផ្សំពិតៗប្រកបដោយគុណភាព',
      textEn:
        'We source high-grade unbleached flours, rich European butter with 82% milkfat, fresh local eggs, and hand-selected Cambodian seasonal fruits like Kampot durian and Keo Romeat mango. No artificial additives, no shortcuts — just honest baking you can taste.',
      textKm:
        'យើងជ្រើសរើសម្សៅមីកម្រិតខ្ពស់ដែលគ្មានជាតិគីមី ប៊ឺរអឺរ៉ុបដែលមានជាតិខ្លាញ់ ៨២% ពងមាន់ស្រស់ក្នុងស្រុក និងផ្លែឈើខ្មែរតាមរដូវដូចជាទុរេនកំពត និងស្វាយកែវរមៀត។ គ្មានសារធាតុរក្សាទុក គ្មានផ្លូវកាត់ — គឺការដុតនំដោយភាពស្មោះត្រង់។',
      image:
        'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1000&q=80',
      imageAltEn: 'Laminated pastry dough with pure French butter',
      imageAltKm: 'ស្រទាប់ម្សៅនំជាមួយប៊ឺរបារាំងសុទ្ធ',
      layout: StoryLayout.IMAGE_RIGHT,
      sortOrder: 2,
      isVisible: true,
    },
    {
      id: 'story-growing-beyond',
      headingEn: 'Growing Beyond Siem Reap',
      headingKm: 'រីកចម្រើនលើសពីសៀមរាប',
      textEn:
        'From our flagship café at Angkor Mansion & Residence, NOST has expanded into trusted wholesale supply for luxury hotels, boutique resorts, and bustling cafés across Cambodia. We share our passion for fresh pastries wherever hospitality thrives.',
      textKm:
        'ចេញពីហាងកាហ្វេដំបូងរបស់យើងនៅ Angkor Mansion & Residence ឥឡូវនេះ NOST បានពង្រីកខ្លួនទៅជាអ្នកផ្គត់ផ្គង់លក់ដុំដ៏គួរឱ្យទុកចិត្តសម្រាប់សណ្ឋាគារប្រណីត រីសត និងហាងកាហ្វេនានាទូទាំងកម្ពុជា។',
      image:
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
      imageAltEn: 'NOST Bakery hospitality partnerships across Cambodia',
      imageAltKm: 'ដៃគូលក់ដុំ NOST Bakery ទូទាំងកម្ពុជា',
      layout: StoryLayout.FULL_WIDTH,
      sortOrder: 3,
      isVisible: true,
    },
  ];

  for (const block of storyBlocksData) {
    await prisma.storyBlock.upsert({
      where: { id: block.id },
      update: block,
      create: block,
    });
  }
  console.log('  ✓ 3 Bakery story blocks configured');

  // ============================================
  // 12. Home Sections (10)
  // ============================================
  console.log('🏠 Seeding home page sections...');
  const homeSectionsData = [
    {
      sectionKey: 'hero',
      headlineEn: 'Fresh from our oven to your table.',
      headlineKm: 'ស្រស់ៗពីចង្ក្រានរបស់យើង ទៅកាន់តុរបស់អ្នក។',
      subHeadlineEn: 'SIEM REAP · BAKERY & PASTRY',
      subHeadlineKm: 'សៀមរាប · នំប៉័ង និង នំផេស្ត្រី',
      bodyEn:
        'Daily fresh breads, pastries and cakes, plus frozen bakery supplies for your business.',
      bodyKm:
        'នំប៉័ង នំផេស្ត្រី និងនំខេកស្រស់ៗរៀងរាល់ថ្ងៃ រួមជាមួយការផ្គត់ផ្គង់នំប៉័ងក្លាស្សេសម្រាប់អាជីវកម្មរបស់អ្នក។',
      buttonLabelEn: 'Order Now',
      buttonLabelKm: 'បញ្ជាទិញឥឡូវ',
      buttonLink: '/contact',
      button2LabelEn: 'Wholesale Enquiry',
      button2LabelKm: 'សាកសួរលក់ដុំ',
      button2Link: '/wholesale',
      image:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1600&q=80',
      sortOrder: 1,
      isVisible: true,
    },
    {
      sectionKey: 'offers',
      headlineEn: "Today's Offers",
      headlineKm: 'ការផ្តល់ជូនពិសេសថ្ងៃនេះ',
      subHeadlineEn: 'Special savings on your favorite freshly baked goods.',
      subHeadlineKm: 'ការបញ្ចុះតម្លៃពិសេសលើនំដុតថ្មីៗដែលអ្នកពេញចិត្ត។',
      bodyEn:
        'Catch our popular evening Buy 1 Get 1 Free deal and seasonal flavour launches.',
      bodyKm: 'រីករាយជាមួយប្រូម៉ូសិនទិញ ១ ថែម ១ ពេលល្ងាច និងការសម្ពោធរសជាតិថ្មីៗ។',
      buttonLabelEn: 'View All Promotions',
      buttonLabelKm: 'មើលការផ្តល់ជូនទាំងអស់',
      buttonLink: '/promotions',
      sortOrder: 2,
      isVisible: true,
    },
    {
      sectionKey: 'categories',
      headlineEn: 'Shop by Category',
      headlineKm: 'ទិញតាមប្រភេទ',
      subHeadlineEn: 'Explore our complete selection of artisanal baked treats and drinks.',
      subHeadlineKm: 'ស្វែងរកជម្រើសនំដុត និងភេសជ្ជៈដ៏សម្បូរបែបរបស់យើង។',
      buttonLabelEn: 'View Full Menu',
      buttonLabelKm: 'មើលបញ្ជីមុខម្ហូបទាំងអស់',
      buttonLink: '/menu',
      sortOrder: 3,
      isVisible: true,
    },
    {
      sectionKey: 'favourites',
      headlineEn: 'Fresh Favourites',
      headlineKm: 'មុខម្ហូបពេញនិយម',
      subHeadlineEn: 'Our most-loved daily baked signature pastries and breads.',
      subHeadlineKm: 'នំផេស្ត្រី និងនំប៉័ងប្រចាំហាងដែលទទួលបានការស្រឡាញ់បំផុត។',
      buttonLabelEn: 'See All Items',
      buttonLabelKm: 'មើលមុខទំនិញទាំងអស់',
      buttonLink: '/menu',
      sortOrder: 4,
      isVisible: true,
    },
    {
      sectionKey: 'promise',
      headlineEn: 'Our Fresh Promise',
      headlineKm: 'ការសន្យាភាពស្រស់ថ្មីរបស់យើង',
      subHeadlineEn: 'Baked every day with real ingredients and careful craft in Siem Reap.',
      subHeadlineKm: 'ដុតនំជារៀងរាល់ថ្ងៃ ជាមួយគ្រឿងផ្សំពិត និងភាពផ្ចិតផ្ចង់នៅសៀមរាប។',
      bodyEn:
        'We wake up early so you can enjoy flaky, buttery pastries and crusty sourdoughs made from natural ingredients without preservatives.',
      bodyKm:
        'យើងក្រោកពីព្រលឹមដើម្បីឱ្យអ្នកទទួលបាននំស្រទាប់ប៊ឺរ និងនំប៉័ងសួរដូរសំបកស្រួយ ផលិតពីគ្រឿងផ្សំធម្មជាតិគ្មានសារធាតុរក្សាទុក។',
      buttonLabelEn: 'Read Our Story',
      buttonLabelKm: 'អានរឿងរ៉ាវរបស់យើង',
      buttonLink: '/bakery',
      sortOrder: 5,
      isVisible: true,
      extraData: {
        points: [
          {
            titleEn: 'Baked Every Day',
            titleKm: 'ដុតរៀងរាល់ថ្ងៃ',
            descEn: 'Fresh batches every morning at 6:00 AM',
            descKm: 'ដុតថ្មីៗរៀងរាល់ព្រឹក ម៉ោង ៦:០០',
          },
          {
            titleEn: 'Real Ingredients',
            titleKm: 'គ្រឿងផ្សំពិតៗ',
            descEn: 'Pure French butter, unbleached flour, no shortcuts',
            descKm: 'ប៊ឺរបារាំងសុទ្ធ ម្សៅគុណភាពខ្ពស់ គ្មានផ្លូវកាត់',
          },
          {
            titleEn: 'Made in Siem Reap',
            titleKm: 'ផលិតនៅសៀមរាប',
            descEn: 'Proudly rooted in the heart of Cambodia',
            descKm: 'ដោយមោទនភាពនៅក្នុងទឹកដីប្រវត្តិសាស្ត្រសៀមរាប',
          },
        ],
      },
    },
    {
      sectionKey: 'business',
      headlineEn: 'For Businesses',
      headlineKm: 'សម្រាប់អាជីវកម្ម',
      subHeadlineEn: 'Bakery supplies for hotels, cafés and restaurants.',
      subHeadlineKm: 'ការផ្គត់ផ្គង់នំប៉័ងសម្រាប់សណ្ឋាគារ ហាងកាហ្វេ និងភោជនីយដ្ឋាន។',
      bodyEn:
        'Raw frozen croissants (small and large), ready-to-bake pastries, and consistent quality with reliable delivery options.',
      bodyKm:
        'ក្រូសង់ក្លាស្សេឆៅ (តូច និងធំ) នំសម្រាប់ដុត និងគុណភាពខ្ពស់ជាប់លាប់ ជាមួយសេវាដឹកជញ្ជូនគួរឱ្យទុកចិត្ត។',
      buttonLabelEn: 'Explore Wholesale',
      buttonLabelKm: 'ស្វែងយល់លក់ដុំ',
      buttonLink: '/wholesale',
      image:
        'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&w=1200&q=80',
      sortOrder: 6,
      isVisible: true,
    },
    {
      sectionKey: 'cafe',
      headlineEn: 'The Café',
      headlineKm: 'ហាងកាហ្វេរបស់យើង',
      subHeadlineEn: 'NOST Bakery Café at Angkor Mansion & Residence',
      subHeadlineKm: 'NOST Bakery Café នៅ Angkor Mansion & Residence',
      bodyEn:
        'Quality baked goods in a cozy setting for travellers, digital nomads, and local pastry lovers.',
      bodyKm:
        'នំដុតគុណភាពខ្ពស់ក្នុងបរិយាកាសកក់ក្តៅ និងផាសុកភាព សម្រាប់អ្នកដំណើរ និងអ្នកស្រឡាញ់នំ។',
      buttonLabelEn: 'Visit Us',
      buttonLabelKm: 'មកកាន់ហាងយើង',
      buttonLink: '/cafe',
      image:
        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
      sortOrder: 7,
      isVisible: true,
    },
    {
      sectionKey: 'reach',
      headlineEn: 'Reach Across Cambodia',
      headlineKm: 'សេវាកម្មទូទាំងប្រទេសកម្ពុជា',
      subHeadlineEn: 'Delivering freshness beyond Siem Reap.',
      subHeadlineKm: 'ការដឹកជញ្ជូនភាពស្រស់ថ្មីលើសពីខេត្តសៀមរាប។',
      bodyEn:
        'With cold chain logistics, our frozen bakery products reach cafés and hotels in Phnom Penh, Battambang, and coastal areas.',
      bodyKm:
        'តាមរយៈប្រព័ន្ធដឹកជញ្ជូនត្រជាក់ស្តង់ដារ ផលិតផលនំប៉័ងក្លាស្សេរបស់យើងអាចទៅដល់ដៃគូនៅភ្នំពេញ បាត់ដំបង និងតំបន់ឆ្នេរ។',
      buttonLabelEn: 'Check Delivery Coverage',
      buttonLabelKm: 'ពិនិត្យតំបន់ដឹកជញ្ជូន',
      buttonLink: '/wholesale',
      sortOrder: 8,
      isVisible: true,
    },
    {
      sectionKey: 'social',
      headlineEn: 'From Our Kitchen',
      headlineKm: 'ទិដ្ឋភាពពីផ្ទះបាយរបស់យើង',
      subHeadlineEn: 'Follow our daily baking journey on Facebook and Telegram.',
      subHeadlineKm: 'តាមដានដំណើរការដុតនំប្រចាំថ្ងៃរបស់យើងនៅលើ Facebook និង Telegram។',
      buttonLabelEn: 'Follow on Facebook',
      buttonLabelKm: 'តាមដានលើ Facebook',
      buttonLink: 'https://www.facebook.com/NOSTBakeryPastry',
      sortOrder: 9,
      isVisible: true,
    },
    {
      sectionKey: 'cta',
      headlineEn: 'Order or Enquire Today',
      headlineKm: 'បញ្ជាទិញ ឬសាកសួរព័ត៌មានថ្ងៃនេះ',
      subHeadlineEn:
        'Have questions about retail pre-orders, celebration cakes, or wholesale distribution?',
      subHeadlineKm:
        'មានសំណួរអំពីការកុម្ម៉ង់នំរាយ នំខួបកំណើត ឬការចែកចាយលក់ដុំមែនទេ?',
      bodyEn:
        'Reach out to our friendly team via Telegram or our contact form. We usually reply within a couple of hours.',
      bodyKm:
        'ទាក់ទងមកកាន់ក្រុមការងាររបស់យើងតាម Telegram ឬទម្រង់ទំនាក់ទំនង។ យើងនឹងឆ្លើយតបយ៉ាងឆាប់រហ័ស។',
      buttonLabelEn: 'Contact Us',
      buttonLabelKm: 'ទាក់ទងមកយើង',
      buttonLink: '/contact',
      button2LabelEn: 'Chat on Telegram',
      button2LabelKm: 'ជជែកតាម Telegram',
      button2Link: 'https://t.me/NostBakery',
      sortOrder: 10,
      isVisible: true,
    },
  ];

  for (const sec of homeSectionsData) {
    await prisma.homeSection.upsert({
      where: { sectionKey: sec.sectionKey },
      update: sec,
      create: sec,
    });
  }
  console.log('  ✓ 10 Home sections configured');

  // ============================================
  // 13. Page SEO (7)
  // ============================================
  console.log('🔍 Seeding Page SEO...');
  const pageSeoData = [
    {
      pageSlug: 'home',
      titleEn: 'NOST Bakery & Pastry — Fresh Bakery in Siem Reap, Cambodia',
      titleKm: 'NOST Bakery & Pastry — នំប៉័ង និង នំផេស្ត្រី ស្រស់ៗ នៅសៀមរាប',
      descriptionEn:
        'Daily fresh French breads, butter croissants, cakes and desserts in Siem Reap. Café dine-in, takeaway, and wholesale frozen bakery supply.',
      descriptionKm:
        'នំប៉័ងបារាំង ក្រូសង់ប៊ឺរ នំខេក និងបង្អែមស្រស់ៗជារៀងរាល់ថ្ងៃនៅសៀមរាប។ មានកាហ្វេ វេចខ្ចប់ និងផ្គត់ផ្គង់នំប៉័ងក្លាស្សេលក់ដុំ។',
      ogImage:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
    },
    {
      pageSlug: 'menu',
      titleEn: 'Menu & Products — NOST Bakery & Pastry Siem Reap',
      titleKm: 'បញ្ជីមុខម្ហូប និងផលិតផល — NOST Bakery & Pastry សៀមរាប',
      descriptionEn:
        'Explore our artisan breads, flaky croissants, custom celebration cakes, Italian tiramisu, and specialty coffees.',
      descriptionKm:
        'ស្វែងរកនំប៉័ង ក្រូសង់ស្រទាប់ស្រួយ នំខេកខួបកំណើត ទីរ៉ាមីស៊ូ និងកាហ្វេពិសេសរបស់យើង។',
      ogImage:
        'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80',
    },
    {
      pageSlug: 'wholesale',
      titleEn: 'Wholesale & Frozen Bakery Supply — NOST Bakery Cambodia',
      titleKm: 'ការផ្គត់ផ្គង់នំប៉័ងក្លាស្សេ និងលក់ដុំ — NOST Bakery កម្ពុជា',
      descriptionEn:
        'Premium raw frozen croissants and ready-to-bake pastries for hotels, resorts, and cafés across Cambodia with cold-chain delivery.',
      descriptionKm:
        'ក្រូសង់ក្លាស្សេឆៅកម្រិតខ្ពស់ និងនំសម្រាប់ដុត សម្រាប់សណ្ឋាគារ រីសត និងហាងកាហ្វេទូទាំងប្រទេសកម្ពុជា។',
      ogImage:
        'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?auto=format&fit=crop&w=1200&q=80',
    },
    {
      pageSlug: 'cafe',
      titleEn: 'Café & Locations — NOST Bakery at Angkor Mansion & Residence',
      titleKm: 'ហាងកាហ្វេ និងទីតាំង — NOST Bakery នៅ Angkor Mansion & Residence',
      descriptionEn:
        'Visit our cozy bakery café in Siem Reap for fresh pastries, barista coffee, and relaxing indoor seating.',
      descriptionKm:
        'អញ្ជើញមកកាន់ហាងកាហ្វេរបស់យើងនៅសៀមរាប ដើម្បីភ្លក់នំផេស្ត្រីស្រស់ៗ កាហ្វេឆ្ងាញ់ និងបរិយាកាសកក់ក្តៅ។',
      ogImage:
        'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80',
    },
    {
      pageSlug: 'bakery',
      titleEn: 'Our Bakery Story — Craft, Passion & Real Ingredients | NOST',
      titleKm: 'រឿងរ៉ាវរបស់យើង — ភាពផ្ចិតផ្ចង់ និងគ្រឿងផ្សំពិត | NOST',
      descriptionEn:
        'Discover the story behind NOST Bakery: European baking traditions, slow fermentation, and the finest ingredients in Cambodia.',
      descriptionKm:
        'ស្វែងយល់ពីរឿងរ៉ាវរបស់ NOST Bakery៖ វិធីដុតនំបែបអឺរ៉ុប ការផ្អាប់យឺតៗ និងគ្រឿងផ្សំដ៏ល្អឥតខ្ចោះនៅកម្ពុជា។',
      ogImage:
        'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
    },
    {
      pageSlug: 'promotions',
      titleEn: 'Special Offers & Promotions — NOST Bakery & Pastry',
      titleKm: 'ការផ្តល់ជូនពិសេស និងប្រូម៉ូសិន — NOST Bakery & Pastry',
      descriptionEn:
        'Current deals including evening Buy 1 Get 1 Free on fresh pastries and new seasonal dessert launches.',
      descriptionKm:
        'ការផ្តល់ជូនពិសេសរួមមាន ទិញ ១ ថែម ១ ពេលល្ងាចលើនំផេស្ត្រី និងការសម្ពោធបង្អែមថ្មីៗតាមរដូវកាល។',
      ogImage:
        'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80',
    },
    {
      pageSlug: 'contact',
      titleEn: 'Contact & Order — NOST Bakery & Pastry Siem Reap',
      titleKm: 'ទាក់ទង និងបញ្ជាទិញ — NOST Bakery & Pastry សៀមរាប',
      descriptionEn:
        'Get in touch for takeaway orders, custom celebration cakes, and wholesale partnership inquiries. Call, email, or message on Telegram.',
      descriptionKm:
        'ទាក់ទងមកយើងសម្រាប់ការបញ្ជាទិញវេចខ្ចប់ នំខេកកម្មវិធី និងការសាកសួរភាពជាដៃគូលក់ដុំ។',
      ogImage:
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  for (const page of pageSeoData) {
    await prisma.pageSeo.upsert({
      where: { pageSlug: page.pageSlug },
      update: page,
      create: page,
    });
  }
  console.log('  ✓ 7 Page SEO records configured');

  // ============================================
  // 14. Gallery Items (6)
  // ============================================
  console.log('🖼️ Seeding gallery items...');
  const galleryItemsData = [
    {
      url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1000&q=80',
      captionEn: 'Golden, honeycomb-layered croissants fresh out of the oven',
      captionKm: 'ក្រូសង់ស្រទាប់ស្រួយពណ៌មាសទើបចេញពីឡដុត',
      altEn: 'Fresh golden croissants cooling on trays',
      altKm: 'ក្រូសង់ពណ៌មាសស្រស់ៗនៅលើថាស',
      showOnHome: true,
      sortOrder: 1,
      type: GalleryType.IMAGE,
    },
    {
      url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80',
      captionEn: 'Rustic sourdough baguettes with crispy crusts',
      captionKm: 'បាហ្គែតសួរដូធម្មជាតិសំបកស្រួយ',
      altEn: 'Artisanal crusty baguettes in bakery basket',
      altKm: 'បាហ្គែតសំបកស្រួយក្នុងកន្ត្រក',
      showOnHome: true,
      sortOrder: 2,
      type: GalleryType.IMAGE,
    },
    {
      url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80',
      captionEn: 'Delicate Durian Cream Cake finished with silky cream',
      captionKm: 'នំខេកសាច់ទុរេនកំពតស្រោបក្រែមស្រស់ទន់ល្មើយ',
      altEn: 'Durian Cream Cake celebration dessert',
      altKm: 'នំខេកទុរេនកំពតពិសេស',
      showOnHome: true,
      sortOrder: 3,
      type: GalleryType.IMAGE,
    },
    {
      url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=1000&q=80',
      captionEn: 'Traditional Italian tiramisu layered with espresso savoiardi',
      captionKm: 'ទីរ៉ាមីស៊ូអ៊ីតាលីប្រពៃណីរសជាតិកាហ្វេ espresso',
      altEn: 'Tiramisu dessert dusted with cocoa',
      altKm: 'បង្អែមទីរ៉ាមីស៊ូស្រោបម្សៅកាកាវ',
      showOnHome: true,
      sortOrder: 4,
      type: GalleryType.IMAGE,
    },
    {
      url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1000&q=80',
      captionEn: 'Handcrafted espresso coffee brewed by our barista',
      captionKm: 'កាហ្វេ espresso ឈ្ងុយឆ្ងាញ់ឆុងដោយបារីស្តាជំនាញ',
      altEn: 'Barista steaming fresh milk for latte art',
      altKm: 'បារីស្តាកំពុងឆុងកាហ្វេជាមួយពពុះទឹកដោះគោ',
      showOnHome: true,
      sortOrder: 5,
      type: GalleryType.IMAGE,
    },
    {
      url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1000&q=80',
      captionEn: 'Sunny afternoon moments inside NOST Bakery Café',
      captionKm: 'បរិយាកាសកក់ក្តៅពេលរសៀលនៅ NOST Bakery Café',
      altEn: 'NOST Bakery Café bright interior tables and plants',
      altKm: 'ទិដ្ឋភាពក្នុងហាង NOST Bakery Café ស្រស់ស្រាយ',
      showOnHome: true,
      sortOrder: 6,
      type: GalleryType.IMAGE,
    },
  ];

  const existingGallery = await prisma.galleryItem.findMany();
  if (existingGallery.length === 0) {
    for (const item of galleryItemsData) {
      await prisma.galleryItem.create({ data: item });
    }
  } else {
    // Upsert or update existing gallery entries
    for (let i = 0; i < galleryItemsData.length; i++) {
      const item = galleryItemsData[i];
      if (existingGallery[i]) {
        await prisma.galleryItem.update({
          where: { id: existingGallery[i].id },
          data: item,
        });
      } else {
        await prisma.galleryItem.create({ data: item });
      }
    }
  }
  console.log('  ✓ 6 Gallery items seeded');

  console.log('🎉 NOST Bakery database seeding completed successfully!');
}

main()
  .catch((error) => {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
