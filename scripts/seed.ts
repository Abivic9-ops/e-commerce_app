import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { connectToDatabase } from '../lib/db/mongoose';
import { Product } from '../lib/db/models/Product';
import { Category } from '../lib/db/models/Category';
import mongoose from 'mongoose';

const seedProducts = [
  // Shoes
  { name: 'Ultra Cushion Sporty Running Sneakers', slug: 'ultra-cushion-sneakers', categorySlug: 'shoes', price: 5200, originalPrice: 8000, stock: 15, featured: true, description: 'High performance running sneakers with ultra cushion technology for maximum comfort.' },
  { name: 'Classic Leather Loafers', slug: 'classic-leather-loafers', categorySlug: 'shoes', price: 4500, originalPrice: 6000, stock: 10, featured: false, description: 'Elegant and comfortable genuine leather loafers for formal and casual wear.' },
  { name: 'High-Top Canvas Sneakers', slug: 'high-top-canvas-sneakers', categorySlug: 'shoes', price: 2500, stock: 30, featured: false, description: 'Durable and stylish high-top canvas sneakers suitable for everyday street style.' },
  { name: 'Trail Blazer Hiking Boots', slug: 'trail-blazer-hiking-boots', categorySlug: 'shoes', price: 7000, originalPrice: 9500, stock: 8, featured: true, description: 'Waterproof rugged hiking boots with enhanced grip for outdoor adventures.' },
  { name: 'Slip-on Casual Walking Shoes', slug: 'slip-on-casual-walking-shoes', categorySlug: 'shoes', price: 3200, stock: 20, featured: false, description: 'Lightweight and breathable slip-on shoes for effortless daily walking.' },
  
  // Electronics (Phones & Accessories)
  { name: 'ShopEasy Phone 12 Pro', slug: 'shopeasy-phone-12-pro', categorySlug: 'electronics', price: 18500, originalPrice: 25000, stock: 12, featured: true, description: 'Flagship smartphone featuring 128GB storage, a stunning AMOLED display, and triple camera setup.' },
  { name: 'ShopEasy Phone 14 Ultra', slug: 'shopeasy-phone-14-ultra', categorySlug: 'electronics', price: 32000, originalPrice: 40000, stock: 5, featured: true, description: 'The ultimate smartphone experience with incredible battery life and a professional-grade camera.' },
  { name: 'Wireless Bluetooth Headphones', slug: 'wireless-bluetooth-headphones', categorySlug: 'electronics', price: 4500, originalPrice: 6500, stock: 18, featured: true, description: 'Active noise-cancelling over-ear headphones with 30 hours of battery life.' },
  { name: 'SmartWatch Pro Health Monitor', slug: 'smart-watch-pro', categorySlug: 'electronics', price: 6500, originalPrice: 12000, stock: 0, featured: false, description: 'Advanced fitness tracker with heart rate, SpO2 monitoring, and sleep tracking features.' },
  { name: 'Premium Glass Electric Kettle', slug: 'premium-glass-kettle', categorySlug: 'electronics', price: 2900, originalPrice: 4500, stock: 25, featured: false, description: 'Fast-boiling stainless steel and glass kettle with LED illumination.' },
  { name: 'Pro Tablet 10-inch', slug: 'pro-tablet-10-inch', categorySlug: 'electronics', price: 15000, stock: 7, featured: true, description: 'Powerful 10-inch tablet perfect for productivity, gaming, and media consumption.' },

  // Fashion & Accessories
  { name: 'Windbreaker Rain Jacket', slug: 'windbreaker-rain-jacket', categorySlug: 'fashion', price: 3500, originalPrice: 5000, stock: 4, featured: true, description: 'Waterproof and windproof shell jacket ideal for unpredictable weather.' },
  { name: 'Classic Felt Fedora Hat', slug: 'classic-felt-fedora', categorySlug: 'fashion', price: 1800, originalPrice: 3000, stock: 3, featured: false, description: 'Vintage style felt fedora with a stylish ribbon band.' },
  { name: 'Slim Fit Chino Pants', slug: 'slim-fit-chinos', categorySlug: 'fashion', price: 2800, originalPrice: 4000, stock: 15, featured: false, description: 'Comfortable stretch cotton chinos tailored for a modern slim fit.' },
  { name: 'Cozy Knitted Winter Sweater', slug: 'cozy-knitted-winter-sweater', categorySlug: 'fashion', price: 2200, stock: 22, featured: true, description: 'Warm and comfortable thick knitted sweater for the cold winter season.' },
  { name: 'Polarized Aviator Sunglasses', slug: 'polarized-aviator-sunglasses', categorySlug: 'fashion', price: 1500, stock: 40, featured: false, description: 'Classic aviator style sunglasses with polarized UV400 lenses.' },

  // Bags
  { name: 'Leather Messenger Crossbody', slug: 'leather-messenger-bag', categorySlug: 'bags', price: 4500, originalPrice: 7500, stock: 6, featured: true, description: 'Premium genuine leather messenger bag with multiple compartments for easy organization.' },
  { name: 'Genuine Leather Bifold Wallet', slug: 'leather-wallet', categorySlug: 'bags', price: 1500, originalPrice: 2500, stock: 20, featured: false, description: 'Sleek bifold wallet featuring RFID blocking technology to keep your cards secure.' },
  { name: 'Travel Duffel Weekender', slug: 'travel-duffel-weekender', categorySlug: 'bags', price: 3800, stock: 12, featured: true, description: 'Spacious and durable canvas duffel bag perfect for weekend getaways and gym trips.' },
  { name: 'Minimalist Urban Backpack', slug: 'minimalist-urban-backpack', categorySlug: 'bags', price: 2900, stock: 14, featured: false, description: 'Water-resistant laptop backpack with a clean, minimalist design for daily commutes.' },
  
  // Home & Living
  { name: 'Ceramic Coffee Mug Set', slug: 'ceramic-coffee-mug-set', categorySlug: 'home', price: 1200, stock: 35, featured: false, description: 'Set of 4 artisan crafted ceramic mugs, perfect for your morning coffee or tea.' },
  { name: 'Aromatherapy Essential Oil Diffuser', slug: 'oil-diffuser', categorySlug: 'home', price: 1800, originalPrice: 2500, stock: 19, featured: true, description: 'Ultrasonic diffuser with 7 LED light colors and auto shut-off function.' },
];

const seedCategories = [
  { name: 'Shoes', slug: 'shoes', iconName: 'Footprints' },
  { name: 'Electronics', slug: 'electronics', iconName: 'Smartphone' },
  { name: 'Fashion', slug: 'fashion', iconName: 'Shirt' },
  { name: 'Bags', slug: 'bags', iconName: 'Briefcase' },
  { name: 'Home', slug: 'home', iconName: 'Home' },
];

async function seed() {
  try {
    await connectToDatabase();
    console.log('Connected to MongoDB.');

    // Clear existing
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('Cleared existing products and categories.');

    // Insert categories
    const createdCategories = await Category.insertMany(seedCategories);
    console.log(`Created ${createdCategories.length} categories.`);

    const categoryMap = createdCategories.reduce((acc, cat) => {
      acc[cat.slug] = cat._id;
      return acc;
    }, {} as Record<string, mongoose.Types.ObjectId>);

    // Map products to categories and insert
    const productsToInsert = seedProducts.map(p => {
      const { categorySlug, ...rest } = p;
      
      let image = 'https://placehold.co/600x600/e2e8f0/1e293b?text=' + encodeURIComponent(p.name);
      if (p.slug === 'ultra-cushion-sneakers') image = 'C:\\Users\\UTAWAZI\\.gemini\\antigravity\\brain\\5ae0896a-e984-4317-a5fd-94ebf3f202b0\\ultra_sneakers_1782987246679.png';
      else if (p.slug === 'classic-leather-loafers') image = 'C:\\Users\\UTAWAZI\\.gemini\\antigravity\\brain\\5ae0896a-e984-4317-a5fd-94ebf3f202b0\\leather_loafers_1782987259586.png';
      else if (p.slug === 'shopeasy-phone-12-pro') image = 'C:\\Users\\UTAWAZI\\.gemini\\antigravity\\brain\\5ae0896a-e984-4317-a5fd-94ebf3f202b0\\smartphone_pro_1782987271457.png';
      else if (p.slug === 'wireless-bluetooth-headphones') image = 'C:\\Users\\UTAWAZI\\.gemini\\antigravity\\brain\\5ae0896a-e984-4317-a5fd-94ebf3f202b0\\wireless_headphones_1782987281305.png';
      else if (p.slug === 'windbreaker-rain-jacket') image = 'C:\\Users\\UTAWAZI\\.gemini\\antigravity\\brain\\5ae0896a-e984-4317-a5fd-94ebf3f202b0\\rain_jacket_1782987290375.png';
      else if (p.slug === 'classic-felt-fedora') image = 'C:\\Users\\UTAWAZI\\.gemini\\antigravity\\brain\\5ae0896a-e984-4317-a5fd-94ebf3f202b0\\felt_fedora_1782987300445.png';

      return {
        ...rest,
        category: categoryMap[categorySlug],
        images: [image],
        sold: 0,
        rating: 4.5,
        reviewsCount: Math.floor(Math.random() * 50) + 1,
      };
    });

    const createdProducts = await Product.insertMany(productsToInsert);
    console.log(`Created ${createdProducts.length} products.`);
    
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
