import { connectToDatabase } from '../lib/db/mongoose';
import { Product } from '../lib/db/models/Product';
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: '.env.local' });

// Configure Cloudinary
// Ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are in .env.local
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadAndSync() {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
      throw new Error('Cloudinary credentials missing in .env.local');
    }

    await connectToDatabase();
    console.log('Connected to MongoDB.');

    // Fetch all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products to process.`);

    for (const product of products) {
      if (!product.images || product.images.length === 0) continue;
      
      const imageUrl = product.images[0];
      
      // If it's already a Cloudinary URL, skip
      if (imageUrl.includes('res.cloudinary.com')) {
        console.log(`Skipping ${product.name}, already on Cloudinary.`);
        continue;
      }

      console.log(`Uploading image for ${product.name}...`);
      
      let imageToUpload = imageUrl;
      if (!imageUrl.startsWith('http')) {
         if (path.isAbsolute(imageUrl)) {
            imageToUpload = imageUrl;
         } else {
            imageToUpload = path.join(process.cwd(), 'public', imageUrl);
         }
      }

      const result = await cloudinary.uploader.upload(imageToUpload, {
        folder: 'ShopEasy',
        use_filename: true,
        unique_filename: false,
      });

      console.log(`Successfully uploaded: ${result.secure_url}`);

      // Update product with Cloudinary URL
      product.images = [result.secure_url];
      await product.save();
    }

    console.log('All products successfully synced with Cloudinary!');
    process.exit(0);
  } catch (error) {
    console.error('Error in upload process:', error);
    process.exit(1);
  }
}

uploadAndSync();
