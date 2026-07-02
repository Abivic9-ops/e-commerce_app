'use server';

import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/db/mongoose';
import { Category } from '@/lib/db/models/Category';
import { Product } from '@/lib/db/models/Product';
import { Coupon } from '@/lib/db/models/Coupon';

interface CategorySeed {
  name: string;
  slug: string;
  image: string;
  iconName: string;
  description: string;
}

interface ProductSeed {
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  categorySlug: string;
  images: string[];
  stock: number;
  sold: number;
  featured: boolean;
  rating: number;
  reviewsCount: number;
}

const categories: CategorySeed[] = [
  {
    name: 'Fashion',
    slug: 'fashion',
    image: '/hero_fashion.png',
    iconName: 'Shirt',
    description: 'Trendy clothing, jackets, hats, and accessories for every style.',
  },
  {
    name: 'Electronics',
    slug: 'electronics',
    image: '/product_phone.png',
    iconName: 'Laptop',
    description: 'Phones, laptops, smart gadgets, and home electronics.',
  },
  {
    name: 'Shoes',
    slug: 'shoes',
    image: '/product_shoes.png',
    iconName: 'Footprints',
    description: 'Sneakers, boots, formal shoes, and sportswear.',
  },
  {
    name: 'Bags',
    slug: 'bags',
    image: '/product_bag.png',
    iconName: 'BaggageClaim',
    description: 'Messenger bags, backpacks, wallets, and travel luggage.',
  },
  {
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    image: '/product_kettle.png',
    iconName: 'Home',
    description: 'Appliances, cookware, kettles, and home essentials.',
  },
];

const products: ProductSeed[] = [
  {
    name: 'Windbreaker Rain Jacket - Waterproof Shell',
    slug: 'windbreaker-rain-jacket',
    description: 'Stay dry and stylish with this premium windbreaker rain jacket. Featuring a waterproof shell, breathable mesh lining, and adjustable hood. Perfect for Nairobi\'s unpredictable weather. Lightweight and packable — fits easily into your everyday bag.',
    price: 3500,
    originalPrice: 5000,
    categorySlug: 'fashion',
    images: ['/product_jacket.png'],
    stock: 20,
    sold: 45,
    featured: true,
    rating: 4.6,
    reviewsCount: 24,
  },
  {
    name: 'Classic Felt Fedora Hat with Ribbon Band',
    slug: 'classic-felt-fedora',
    description: 'Elevate your look with this classic felt fedora. Crafted from soft wool blend with a structured brim and satin ribbon band. Available in multiple sizes. A timeless accessory for both casual and formal occasions.',
    price: 1800,
    originalPrice: 3000,
    categorySlug: 'fashion',
    images: ['/product_hat.png'],
    stock: 15,
    sold: 28,
    featured: true,
    rating: 4.3,
    reviewsCount: 14,
  },
  {
    name: 'Leather Messenger Crossbody Shoulder Bag',
    slug: 'leather-messenger-bag',
    description: 'Handcrafted genuine leather messenger bag with padded laptop compartment. Features multiple zip pockets, adjustable crossbody strap, and antique brass hardware. Ideal for professionals and students on the go.',
    price: 4500,
    originalPrice: 7500,
    categorySlug: 'bags',
    images: ['/product_bag.png'],
    stock: 10,
    sold: 62,
    featured: true,
    rating: 4.8,
    reviewsCount: 32,
  },
  {
    name: 'Ultra Cushion Sporty Running Sneakers',
    slug: 'ultra-cushion-sneakers',
    description: 'Engineered for comfort with ultra-cushion memory foam insoles and breathable knit upper. These running sneakers provide excellent arch support and shock absorption. Perfect for daily jogs, gym sessions, or casual wear.',
    price: 5200,
    originalPrice: 8000,
    categorySlug: 'shoes',
    images: ['/product_shoes.png'],
    stock: 25,
    sold: 78,
    featured: true,
    rating: 4.7,
    reviewsCount: 45,
  },
  {
    name: 'ShopEasy Phone 12 Pro - 128GB, Triple Camera',
    slug: 'shopeasy-phone-12-pro',
    description: 'Experience flagship performance with the ShopEasy Phone 12 Pro. Features a stunning 6.7" AMOLED display, triple 48MP camera system, 128GB internal storage, and 8GB RAM. Dual SIM with 4G/5G support. Unlocked for all Kenyan networks.',
    price: 18500,
    originalPrice: 25000,
    categorySlug: 'electronics',
    images: ['/product_phone.png'],
    stock: 12,
    sold: 112,
    featured: false,
    rating: 4.5,
    reviewsCount: 112,
  },
  {
    name: 'Premium Stainless Steel & Glass Electric Kettle',
    slug: 'premium-glass-kettle',
    description: 'Boil water in minutes with this premium electric kettle. Features a borosilicate glass body, stainless steel heating element, auto shut-off, and boil-dry protection. 1.7L capacity — perfect for tea, coffee, and instant meals.',
    price: 2900,
    originalPrice: 4500,
    categorySlug: 'home-kitchen',
    images: ['/product_kettle.png'],
    stock: 30,
    sold: 89,
    featured: false,
    rating: 4.4,
    reviewsCount: 89,
  },
  {
    name: 'Wireless Bluetooth Headphones - Noise Cancelling',
    slug: 'wireless-bluetooth-headphones',
    description: 'Immerse yourself in crystal-clear audio with active noise cancellation. These over-ear Bluetooth headphones deliver 30 hours of playtime, memory foam ear cushions, and a foldable design for easy portability. Built-in microphone for hands-free calls.',
    price: 4500,
    originalPrice: 6500,
    categorySlug: 'electronics',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'],
    stock: 18,
    sold: 67,
    featured: false,
    rating: 4.7,
    reviewsCount: 67,
  },
  {
    name: 'Slim Fit Chino Pants - Stretch Cotton',
    slug: 'slim-fit-chinos',
    description: 'Modern slim fit chino pants crafted from premium stretch cotton twill. Features a mid-rise waist, tapered leg, and classic chino pockets. Comfortable enough for all-day wear — pairs perfectly with both casual tees and button-down shirts.',
    price: 2800,
    originalPrice: 4000,
    categorySlug: 'fashion',
    images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=400&fit=crop'],
    stock: 22,
    sold: 38,
    featured: false,
    rating: 4.2,
    reviewsCount: 38,
  },
  {
    name: 'Genuine Leather Bifold Wallet - RFID Blocking',
    slug: 'leather-wallet',
    description: 'Slim bifold wallet crafted from 100% genuine leather with RFID blocking technology. Features 6 card slots, 2 hidden pockets, and a full-length bill compartment. Available in multiple colors. A perfect gift for men.',
    price: 1500,
    originalPrice: 2500,
    categorySlug: 'bags',
    images: ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop'],
    stock: 40,
    sold: 53,
    featured: false,
    rating: 4.6,
    reviewsCount: 53,
  },
  {
    name: 'SmartWatch Pro - Fitness Tracker & Health Monitor',
    slug: 'smart-watch-pro',
    description: 'Your complete health companion. Features heart rate monitoring, blood oxygen tracking, sleep analysis, step counter, and 20+ sport modes. 1.5" AMOLED display with always-on mode. Water resistant to 50m. Compatible with iOS and Android.',
    price: 6500,
    originalPrice: 12000,
    categorySlug: 'electronics',
    images: ['https://images.unsplash.com/photo-1722152845711-be94a0751c8c?w=400&h=400&fit=crop'],
    stock: 0,
    sold: 28,
    featured: false,
    rating: 4.3,
    reviewsCount: 28,
  },
  {
    name: 'Casual Denim Jacket - Classic Blue',
    slug: 'casual-denim-jacket',
    description: 'A wardrobe staple — this classic denim jacket features a regular fit, button-down front, chest pockets, and adjustable waist tabs. Made from 100% cotton denim with a medium wash finish. Pairs perfectly with any outfit.',
    price: 3200,
    originalPrice: 4800,
    categorySlug: 'fashion',
    images: ['/product_jacket.png'],
    stock: 14,
    sold: 31,
    featured: false,
    rating: 4.4,
    reviewsCount: 19,
  },
  {
    name: 'Portable Bluetooth Speaker - Deep Bass',
    slug: 'portable-bluetooth-speaker',
    description: 'Take the party anywhere with this rugged portable Bluetooth speaker. Delivers deep bass and 360-degree sound. IPX7 waterproof rating, 20-hour battery life, and built-in microphone. Features USB-C charging and aux input.',
    price: 3800,
    originalPrice: 5500,
    categorySlug: 'electronics',
    images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop'],
    stock: 16,
    sold: 44,
    featured: false,
    rating: 4.5,
    reviewsCount: 36,
  },
  {
    name: 'Leather Crossbody Phone Bag - Mini',
    slug: 'leather-crossbody-phone-bag',
    description: 'Compact and stylish crossbody bag designed to hold your phone, cards, and keys. Made from genuine leather with an adjustable strap and magnetic snap closure. Available in black, brown, and tan.',
    price: 2200,
    originalPrice: 3500,
    categorySlug: 'bags',
    images: ['/product_bag.png'],
    stock: 18,
    sold: 47,
    featured: false,
    rating: 4.5,
    reviewsCount: 22,
  },
  {
    name: 'Non-Stick Frying Pan Set - 3 Piece',
    slug: 'non-stick-frying-pan-set',
    description: 'Upgrade your kitchen with this premium non-stick frying pan set. Includes 20cm, 24cm, and 28cm pans with ergonomic handles and tempered glass lids. Suitable for all hob types including induction. PFOA-free coating.',
    price: 4500,
    originalPrice: 6500,
    categorySlug: 'home-kitchen',
    images: ['/product_kettle.png'],
    stock: 8,
    sold: 23,
    featured: false,
    rating: 4.6,
    reviewsCount: 17,
  },
];

export async function seedDatabase() {
  try {
    await connectToDatabase();

    const existingCategories = await Category.countDocuments();
    const existingProducts = await Product.countDocuments();

    if (existingCategories > 0 || existingProducts > 0) {
      return {
        success: false,
        message: `Database already has ${existingCategories} categories and ${existingProducts} products. Run forceSeed() to reset and re-seed.`,
        categories: existingCategories,
        products: existingProducts,
      };
    }

    const createdCategories = await Category.insertMany(
      categories.map((c) => ({
        name: c.name,
        slug: c.slug,
        image: c.image,
        iconName: c.iconName,
      }))
    );

    const categoryMap = new Map(createdCategories.map((c) => [c.slug, c._id]));

    const productDocs = products.map((p) => ({
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      originalPrice: p.originalPrice,
      category: categoryMap.get(p.categorySlug)!,
      images: p.images.map((img: string) =>
        img.startsWith('/product_')
          ? `https://picsum.photos/seed/${p.slug}/400/400`
          : img
      ),
      stock: p.stock,
      sold: p.sold,
      featured: p.featured,
      rating: p.rating,
      reviewsCount: p.reviewsCount,
    }));

    await Product.insertMany(productDocs);

    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath('/admin');

    return {
      success: true,
      message: `Seeded ${createdCategories.length} categories and ${productDocs.length} products successfully!`,
      categories: createdCategories.length,
      products: productDocs.length,
    };
  } catch (error: any) {
    console.error('Seed error:', error);
    return {
      success: false,
      message: error.message || 'Failed to seed database.',
    };
  }
}

export async function forceSeedDatabase() {
  try {
    await connectToDatabase();

    await Category.deleteMany({});
    await Product.deleteMany({});

    const createdCategories = await Category.insertMany(
      categories.map((c) => ({
        name: c.name,
        slug: c.slug,
        image: c.image,
        iconName: c.iconName,
      }))
    );

    const categoryMap = new Map(createdCategories.map((c) => [c.slug, c._id]));

    const productDocs = products.map((p) => ({
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price,
      originalPrice: p.originalPrice,
      category: categoryMap.get(p.categorySlug)!,
      images: p.images.map((img: string) =>
        img.startsWith('/product_')
          ? `https://picsum.photos/seed/${p.slug}/400/400`
          : img
      ),
      stock: p.stock,
      sold: p.sold,
      featured: p.featured,
      rating: p.rating,
      reviewsCount: p.reviewsCount,
    }));

    await Product.insertMany(productDocs);

    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath('/admin');

    return {
      success: true,
      message: `Force re-seeded ${createdCategories.length} categories and ${productDocs.length} products!`,
      categories: createdCategories.length,
      products: productDocs.length,
    };
  } catch (error: any) {
    console.error('Force seed error:', error);
    return {
      success: false,
      message: error.message || 'Failed to force seed database.',
    };
  }
}
