'use server';

import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/db/mongoose';
import { Product } from '@/lib/db/models/Product';
import { Category } from '@/lib/db/models/Category';
import { requireRole } from '@/lib/supabase/auth';

interface ProductInput {
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string; // Category ID
  images: string[];
  stock: number;
  featured?: boolean;
}

/**
 * Public action to retrieve products with optional category and search filters.
 */
export async function getProducts(filters?: { categoryId?: string; search?: string; limit?: number }) {
  try {
    await connectToDatabase();
    
    // Build query object
    const query: any = {};
    
    if (filters?.categoryId) {
      query.category = filters.categoryId;
    }
    
    if (filters?.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }
    
    let dbQuery = Product.find(query).populate('category').sort({ createdAt: -1 });
    
    if (filters?.limit) {
      dbQuery = dbQuery.limit(filters.limit);
    }
    
    const products = await dbQuery.lean();
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Public action to retrieve a single product by its slug.
 */
export async function getProductBySlug(slug: string) {
  try {
    await connectToDatabase();
    const product = await Product.findOne({ slug: slug.toLowerCase().trim() }).populate('category').lean();
    return product ? JSON.parse(JSON.stringify(product)) : null;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

/**
 * Admin action to create a new product.
 */
export async function createProduct(formData: ProductInput) {
  await requireRole('admin');
  await connectToDatabase();

  try {
    const existing = await Product.findOne({ slug: formData.slug.toLowerCase().trim() });
    if (existing) {
      return { success: false, error: 'Product with this slug already exists.' };
    }

    // Verify category exists
    const categoryExists = await Category.findById(formData.category);
    if (!categoryExists) {
      return { success: false, error: 'Target category does not exist.' };
    }

    const newProduct = new Product({
      name: formData.name.trim(),
      slug: formData.slug.toLowerCase().trim(),
      description: formData.description.trim(),
      price: formData.price,
      originalPrice: formData.originalPrice || undefined,
      category: formData.category,
      images: formData.images && formData.images.length > 0 ? formData.images : ['/product_shoes.png'],
      stock: formData.stock,
      featured: formData.featured || false,
      sold: 0,
      rating: 0,
      reviewsCount: 0,
    });

    await newProduct.save();

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error('Error creating product:', error);
    return { success: false, error: error.message || 'Failed to create product.' };
  }
}

/**
 * Admin action to update an existing product.
 */
export async function updateProduct(id: string, formData: ProductInput) {
  await requireRole('admin');
  await connectToDatabase();

  try {
    // Verify category exists
    const categoryExists = await Category.findById(formData.category);
    if (!categoryExists) {
      return { success: false, error: 'Target category does not exist.' };
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      {
        name: formData.name.trim(),
        slug: formData.slug.toLowerCase().trim(),
        description: formData.description.trim(),
        price: formData.price,
        originalPrice: formData.originalPrice || undefined,
        category: formData.category,
        images: formData.images && formData.images.length > 0 ? formData.images : ['/product_shoes.png'],
        stock: formData.stock,
        featured: formData.featured || false,
      },
      { new: true }
    );

    if (!updated) {
      return { success: false, error: 'Product not found.' };
    }

    revalidatePath('/');
    revalidatePath(`/admin`);
    return { success: true };
  } catch (error: any) {
    console.error('Error updating product:', error);
    return { success: false, error: error.message || 'Failed to update product.' };
  }
}

/**
 * Admin action to delete a product.
 */
export async function deleteProduct(id: string) {
  await requireRole('admin');
  await connectToDatabase();

  try {
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return { success: false, error: 'Product not found.' };
    }

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return { success: false, error: error.message || 'Failed to delete product.' };
  }
}
