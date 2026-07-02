import mongoose from 'mongoose';
<<<<<<< HEAD
import { readFileSync } from 'fs';

const envFile = readFileSync(new URL('../.env.local', import.meta.url), 'utf-8');
for (const line of envFile.split('\n')) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  }
}

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;
=======

const MONGODB_URI = 'mongodb+srv://vmwendwa486_db_user:Vessorian6@shopeasy.smyegjx.mongodb.net/?retryWrites=true&w=majority&appName=ShopEasy';
const MONGODB_DB = 'ecommerce_db';
>>>>>>> 0d34726455bfd441e44e34ddc0d4ab27d8638e52

const categories = [
  { name: 'Fashion', slug: 'fashion', image: '/hero_fashion.png', iconName: 'Shirt' },
  { name: 'Electronics', slug: 'electronics', image: '/product_phone.png', iconName: 'Laptop' },
  { name: 'Shoes', slug: 'shoes', image: '/product_shoes.png', iconName: 'Footprints' },
  { name: 'Bags', slug: 'bags', image: '/product_bag.png', iconName: 'BaggageClaim' },
  { name: 'Home & Kitchen', slug: 'home-kitchen', image: '/product_kettle.png', iconName: 'Home' },
];

const products = [
  // --- FASHION (8 products) ---
  {
    name: 'Windbreaker Rain Jacket - Waterproof Shell',
    slug: 'windbreaker-rain-jacket',
    description: 'Stay dry and stylish with this premium windbreaker rain jacket. Featuring a waterproof shell, breathable mesh lining, and adjustable hood. Perfect for Nairobi\'s unpredictable weather. Lightweight and packable.',
    price: 3500, originalPrice: 5000, categorySlug: 'fashion',
    images: ['/product_jacket.png'], stock: 20, sold: 45, featured: true, rating: 4.6, reviewsCount: 24,
  },
  {
    name: 'Classic Felt Fedora Hat with Ribbon Band',
    slug: 'classic-felt-fedora',
    description: 'Elevate your look with this classic felt fedora. Crafted from soft wool blend with a structured brim and satin ribbon band. Available in multiple sizes.',
    price: 1800, originalPrice: 3000, categorySlug: 'fashion',
    images: ['/product_hat.png'], stock: 15, sold: 28, featured: true, rating: 4.3, reviewsCount: 14,
  },
  {
    name: 'Slim Fit Chino Pants - Stretch Cotton',
    slug: 'slim-fit-chinos',
    description: 'Modern slim fit chino pants crafted from premium stretch cotton twill. Features a mid-rise waist, tapered leg, and classic chino pockets. Comfortable for all-day wear.',
    price: 2800, originalPrice: 4000, categorySlug: 'fashion',
    images: ['/product_bag.png'], stock: 22, sold: 38, featured: false, rating: 4.2, reviewsCount: 38,
  },
  {
    name: 'Casual Denim Jacket - Classic Blue Wash',
    slug: 'casual-denim-jacket',
    description: 'A wardrobe staple — this classic denim jacket features a regular fit, button-down front, chest pockets, and adjustable waist tabs. Made from 100% cotton denim.',
    price: 3200, originalPrice: 4800, categorySlug: 'fashion',
    images: ['/product_jacket.png'], stock: 14, sold: 31, featured: false, rating: 4.4, reviewsCount: 19,
  },
  {
    name: 'Striped Cotton T-Shirt - Relaxed Fit',
    slug: 'striped-cotton-tshirt',
    description: 'Everyday essential relaxed fit striped t-shirt made from 100% organic cotton. Classic crew neck, short sleeves, and soft washed finish. Available in 5 colors.',
    price: 1200, originalPrice: 1800, categorySlug: 'fashion',
    images: ['/product_hat.png'], stock: 50, sold: 120, featured: false, rating: 4.1, reviewsCount: 67,
  },
  {
    name: 'Tailored Blazer - Slim Fit Suit Jacket',
    slug: 'tailored-blazer',
    description: 'Sharp slim fit blazer with two-button closure, notch lapels, and interior pockets. Perfect for office wear, interviews, and formal events.',
    price: 8500, originalPrice: 12000, categorySlug: 'fashion',
    images: ['/product_jacket.png'], stock: 8, sold: 22, featured: true, rating: 4.7, reviewsCount: 16,
  },
  {
    name: 'Cashmere Blend Scarf - Winter Warmth',
    slug: 'cashmere-blend-scarf',
    description: 'Luxury cashmere blend scarf — soft, warm, and lightweight. 180cm x 30cm with fringed edges. A perfect gift for the cold season.',
    price: 2200, originalPrice: 3500, categorySlug: 'fashion',
    images: ['/product_hat.png'], stock: 25, sold: 44, featured: false, rating: 4.5, reviewsCount: 12,
  },
  {
    name: 'Leather Belt - Premium Cowhide',
    slug: 'leather-belt',
    description: 'Handcrafted full-grain cowhide leather belt with polished nickel buckle. 35mm width, sizes 30-42. Clean, minimalist design.',
    price: 1800, originalPrice: 2500, categorySlug: 'fashion',
    images: ['/product_bag.png'], stock: 35, sold: 58, featured: false, rating: 4.3, reviewsCount: 21,
  },
  // --- ELECTRONICS (8 products) ---
  {
    name: 'ShopEasy Phone 12 Pro - 128GB, Triple Camera',
    slug: 'shopeasy-phone-12-pro',
    description: 'Flagship performance with 6.7" AMOLED display, triple 48MP camera, 128GB storage, and 8GB RAM. Dual SIM with 4G/5G support. Unlocked for all Kenyan networks.',
    price: 18500, originalPrice: 25000, categorySlug: 'electronics',
    images: ['/product_phone.png'], stock: 12, sold: 112, featured: true, rating: 4.5, reviewsCount: 112,
  },
  {
    name: 'Wireless Bluetooth Headphones - Noise Cancelling',
    slug: 'wireless-bluetooth-headphones',
    description: 'Crystal-clear audio with active noise cancellation. 30 hours playtime, memory foam ear cushions, foldable design, and built-in microphone.',
    price: 4500, originalPrice: 6500, categorySlug: 'electronics',
    images: ['/product_jacket.png'], stock: 18, sold: 67, featured: false, rating: 4.7, reviewsCount: 67,
  },
  {
    name: 'SmartWatch Pro - Fitness Tracker & Health',
    slug: 'smart-watch-pro',
    description: 'Heart rate monitoring, blood oxygen tracking, sleep analysis, step counter, and 20+ sport modes. 1.5" AMOLED display. Water resistant to 50m.',
    price: 6500, originalPrice: 12000, categorySlug: 'electronics',
    images: ['/product_hat.png'], stock: 0, sold: 28, featured: false, rating: 4.3, reviewsCount: 28,
  },
  {
    name: 'Portable Bluetooth Speaker - Deep Bass',
    slug: 'portable-bluetooth-speaker',
    description: 'Rugged portable speaker with deep bass and 360-degree sound. IPX7 waterproof, 20-hour battery, built-in mic, USB-C charging.',
    price: 3800, originalPrice: 5500, categorySlug: 'electronics',
    images: ['/product_phone.png'], stock: 16, sold: 44, featured: false, rating: 4.5, reviewsCount: 36,
  },
  {
    name: 'USB-C Fast Charger 65W - GaN Technology',
    slug: 'usb-c-fast-charger',
    description: 'Super-fast 65W GaN charger for laptops, tablets, and phones. Dual USB-C ports with Power Delivery 3.0. Compact foldable design.',
    price: 2500, originalPrice: 3500, categorySlug: 'electronics',
    images: ['/product_phone.png'], stock: 40, sold: 95, featured: false, rating: 4.6, reviewsCount: 73,
  },
  {
    name: 'Wireless Ergonomic Mouse - Silent Click',
    slug: 'wireless-ergonomic-mouse',
    description: 'Ergonomic wireless mouse with silent click. Adjustable DPI (800-2400), dual USB/Bluetooth mode, 12-month battery life.',
    price: 1800, originalPrice: 2500, categorySlug: 'electronics',
    images: ['/product_phone.png'], stock: 30, sold: 51, featured: false, rating: 4.4, reviewsCount: 29,
  },
  {
    name: 'Adjustable Aluminum Laptop Stand',
    slug: 'laptop-stand',
    description: 'Premium aluminum stand with 6 height levels, fits 10-17" laptops. Ergonomic design with ventilated honeycomb surface.',
    price: 3200, originalPrice: 4500, categorySlug: 'electronics',
    images: ['/product_kettle.png'], stock: 12, sold: 33, featured: false, rating: 4.5, reviewsCount: 18,
  },
  {
    name: 'HDMI Cable 4K - 2 Meters Braided',
    slug: 'hdmi-cable-4k',
    description: 'High-speed HDMI 2.1 cable supporting 4K@60Hz, HDR, eARC. Braided nylon jacket, gold-plated connectors.',
    price: 800, originalPrice: 1200, categorySlug: 'electronics',
    images: ['/product_phone.png'], stock: 60, sold: 134, featured: false, rating: 4.2, reviewsCount: 45,
  },
  // --- SHOES (6 products) ---
  {
    name: 'Ultra Cushion Running Sneakers',
    slug: 'ultra-cushion-sneakers',
    description: 'Memory foam insoles and breathable knit upper with excellent arch support. Perfect for daily jogs, gym, or casual wear.',
    price: 5200, originalPrice: 8000, categorySlug: 'shoes',
    images: ['/product_shoes.png'], stock: 25, sold: 78, featured: true, rating: 4.7, reviewsCount: 45,
  },
  {
    name: 'Classic Leather Loafers - Slip On',
    slug: 'classic-leather-loafers',
    description: 'Sophisticated slip-on loafers from genuine calf leather. Cushioned insole, rubber outsole, classic penny strap.',
    price: 4800, originalPrice: 7000, categorySlug: 'shoes',
    images: ['/product_shoes.png'], stock: 10, sold: 34, featured: false, rating: 4.5, reviewsCount: 19,
  },
  {
    name: 'High Top Canvas Sneakers - Street Style',
    slug: 'high-top-canvas-sneakers',
    description: 'Classic high-top canvas sneakers with vulcanized rubber sole. Metal eyelets, padded collar. A streetwear essential.',
    price: 2500, originalPrice: 3800, categorySlug: 'shoes',
    images: ['/product_shoes.png'], stock: 30, sold: 89, featured: false, rating: 4.3, reviewsCount: 52,
  },
  {
    name: 'Formal Oxford Dress Shoes - Leather',
    slug: 'formal-oxford-shoes',
    description: 'Timeless Oxford dress shoes from polished calf leather. Lace-up closure, cap toe, cushioned footbed. Perfect for business.',
    price: 6500, originalPrice: 9500, categorySlug: 'shoes',
    images: ['/product_shoes.png'], stock: 6, sold: 17, featured: false, rating: 4.6, reviewsCount: 11,
  },
  {
    name: 'Slide Sandals - Comfort Cushion',
    slug: 'slide-sandals',
    description: 'Ultra-comfortable slides with contoured EVA footbed and padded strap. Lightweight, waterproof. Perfect for beach or casual wear.',
    price: 1200, originalPrice: 1800, categorySlug: 'shoes',
    images: ['/product_shoes.png'], stock: 45, sold: 112, featured: false, rating: 4.1, reviewsCount: 33,
  },
  {
    name: 'Ankle Boots - Chunky Heel',
    slug: 'ankle-boots-chunky-heel',
    description: 'Trendy ankle boots with 6cm chunky block heel. Faux leather, side zip, cushioned insole. Pairs with jeans and dresses.',
    price: 4200, originalPrice: 6000, categorySlug: 'shoes',
    images: ['/product_shoes.png'], stock: 8, sold: 26, featured: true, rating: 4.4, reviewsCount: 15,
  },
  // --- BAGS (6 products) ---
  {
    name: 'Leather Messenger Crossbody Bag',
    slug: 'leather-messenger-bag',
    description: 'Handcrafted genuine leather messenger with padded laptop compartment, multiple zip pockets, adjustable crossbody strap.',
    price: 4500, originalPrice: 7500, categorySlug: 'bags',
    images: ['/product_bag.png'], stock: 10, sold: 62, featured: true, rating: 4.8, reviewsCount: 32,
  },
  {
    name: 'RFID Blocking Leather Bifold Wallet',
    slug: 'leather-wallet',
    description: 'Slim bifold from 100% genuine leather with RFID blocking. 6 card slots, 2 hidden pockets, full-length bill compartment.',
    price: 1500, originalPrice: 2500, categorySlug: 'bags',
    images: ['/product_shoes.png'], stock: 40, sold: 53, featured: false, rating: 4.6, reviewsCount: 53,
  },
  {
    name: 'Mini Leather Crossbody Phone Bag',
    slug: 'leather-crossbody-phone-bag',
    description: 'Compact genuine leather bag for phone, cards, and keys. Adjustable strap, magnetic snap closure. Black, brown, tan.',
    price: 2200, originalPrice: 3500, categorySlug: 'bags',
    images: ['/product_bag.png'], stock: 18, sold: 47, featured: false, rating: 4.5, reviewsCount: 22,
  },
  {
    name: '40L Water Resistant Travel Backpack',
    slug: 'travel-backpack-40l',
    description: 'Spacious 40L backpack with padded 15.6" laptop compartment, multiple organizers, hidden security pocket, breathable back.',
    price: 5500, originalPrice: 8000, categorySlug: 'bags',
    images: ['/product_bag.png'], stock: 7, sold: 29, featured: true, rating: 4.7, reviewsCount: 24,
  },
  {
    name: 'Canvas Tote Bag - Shopping Essential',
    slug: 'canvas-tote-bag',
    description: 'Heavy-duty 100% cotton canvas tote with reinforced handles. 6 colors. Eco-friendly and reusable.',
    price: 1200, originalPrice: 1800, categorySlug: 'bags',
    images: ['/product_bag.png'], stock: 50, sold: 145, featured: false, rating: 4.2, reviewsCount: 78,
  },
  {
    name: 'USB Laptop Backpack - Anti Theft',
    slug: 'laptop-backpack-usb',
    description: 'Smart backpack with USB charging port, fits 17.3" laptop. Anti-theft rear pocket, padded straps, luggage strap.',
    price: 3800, originalPrice: 5500, categorySlug: 'bags',
    images: ['/product_bag.png'], stock: 12, sold: 41, featured: false, rating: 4.4, reviewsCount: 31,
  },
  // --- HOME & KITCHEN (6 products) ---
  {
    name: 'Glass Electric Kettle - 1.7L',
    slug: 'premium-glass-kettle',
    description: 'Borosilicate glass kettle with stainless steel heating element. Auto shut-off, boil-dry protection. 1.7L capacity.',
    price: 2900, originalPrice: 4500, categorySlug: 'home-kitchen',
    images: ['/product_kettle.png'], stock: 30, sold: 89, featured: false, rating: 4.4, reviewsCount: 89,
  },
  {
    name: 'Non-Stick Frying Pan Set - 3 Piece',
    slug: 'non-stick-frying-pan-set',
    description: 'Set of 3 (20cm, 24cm, 28cm) with ergonomic handles and glass lids. Suitable for all hobs including induction. PFOA-free.',
    price: 4500, originalPrice: 6500, categorySlug: 'home-kitchen',
    images: ['/product_kettle.png'], stock: 8, sold: 23, featured: false, rating: 4.6, reviewsCount: 17,
  },
  {
    name: 'Stainless Steel Thermos Flask - 1L',
    slug: 'stainless-thermos-flask',
    description: 'Double-wall vacuum insulated. Hot for 12h, cold for 24h. 1L capacity, leak-proof screw cap.',
    price: 2200, originalPrice: 3200, categorySlug: 'home-kitchen',
    images: ['/product_kettle.png'], stock: 20, sold: 55, featured: false, rating: 4.5, reviewsCount: 28,
  },
  {
    name: 'Scented Soy Candle Set - Lavender & Vanilla',
    slug: 'scented-candle-set',
    description: 'Set of 3 hand-poured soy wax candles (lavender, vanilla, eucalyptus). 40+ hours each. Glass jars with bamboo lids.',
    price: 1800, originalPrice: 2800, categorySlug: 'home-kitchen',
    images: ['/product_kettle.png'], stock: 25, sold: 67, featured: false, rating: 4.3, reviewsCount: 38,
  },
  {
    name: 'Bamboo Cutting Board Set - 3 Sizes',
    slug: 'bamboo-cutting-board-set',
    description: 'Eco-friendly bamboo, 3 sizes. Naturally antimicrobial, knife-friendly. Juice groove and easy-grip handles.',
    price: 2000, originalPrice: 3000, categorySlug: 'home-kitchen',
    images: ['/product_kettle.png'], stock: 15, sold: 36, featured: false, rating: 4.4, reviewsCount: 19,
  },
  {
    name: 'Microfiber Cleaning Cloths - 12 Pack',
    slug: 'microfiber-cleaning-cloth',
    description: 'Ultra-absorbent, lint-free, streak-free. 12 pack in 4 colors. Machine washable up to 500 times.',
    price: 800, originalPrice: 1200, categorySlug: 'home-kitchen',
    images: ['/product_kettle.png'], stock: 60, sold: 210, featured: false, rating: 4.6, reviewsCount: 95,
  },
];

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI, { dbName: MONGODB_DB, serverSelectionTimeoutMS: 10000 });
  console.log('Connected to MongoDB!\n');

  const db = mongoose.connection.db;

  // Clear existing data
  const catCount = await db.collection('categories').countDocuments();
  const prodCount = await db.collection('products').countDocuments();
  console.log(`Existing data: ${catCount} categories, ${prodCount} products`);

  await db.collection('categories').deleteMany({});
  await db.collection('products').deleteMany({});
  console.log('Cleared old data.\n');

  // Insert categories
  const catResult = await db.collection('categories').insertMany(categories);
  console.log(`✓ Created ${catResult.insertedCount} categories`);

  // Map slugs to ObjectIds
  const catDocs = await db.collection('categories').find({}).toArray();
  const catMap = {};
  catDocs.forEach(c => { catMap[c.slug] = c._id; });

  // Insert products
  const productDocs = products.map(p => ({
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    originalPrice: p.originalPrice,
    category: catMap[p.categorySlug],
    images: p.images.map(img =>
      img.startsWith('/product_')
        ? `https://picsum.photos/seed/${p.slug}/400/400`
        : img
    ),
    stock: p.stock,
    sold: p.sold,
    featured: p.featured,
    rating: p.rating,
    reviewsCount: p.reviewsCount,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  const prodResult = await db.collection('products').insertMany(productDocs);
  console.log(`✓ Created ${prodResult.insertedCount} products`);

  console.log('\n========================================');
  console.log('  DATABASE SEEDED SUCCESSFULLY!');
  console.log(`  ${catResult.insertedCount} Categories`);
  console.log(`  ${prodResult.insertedCount} Products`);
  console.log('========================================\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
