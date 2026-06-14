'use server';

import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/db/mongoose';
import { Category } from '@/lib/db/models/Category';
import { Product } from '@/lib/db/models/Product';
import { requireRole } from '@/lib/supabase/auth';

/**
 * Public action to retrieve all categories sorted by name.
 */
export async function getCategories() {
  try {
    await connectToDatabase();
    const categories = await Category.find({}).sort({ name: 1 }).lean();
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

/**
 * Admin action to create a new category.
 */
export async function createCategory(formData: { name: string; slug: string; image?: string; iconName?: string }) {
  await requireRole('admin');
  await connectToDatabase();

  try {
    const existing = await Category.findOne({ slug: formData.slug.toLowerCase().trim() });
    if (existing) {
      return { success: false, error: 'Category with this slug already exists.' };
    }

    const newCategory = new Category({
      name: formData.name.trim(),
      slug: formData.slug.toLowerCase().trim(),
      image: formData.image || '',
      iconName: formData.iconName || 'Package',
    });
    
    await newCategory.save();

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error('Error creating category:', error);
    return { success: false, error: error.message || 'Failed to create category.' };
  }
}

/**
 * Admin action to update an existing category.
 */
export async function updateCategory(
  id: string,
  formData: { name: string; slug: string; image?: string; iconName?: string }
) {
  await requireRole('admin');
  await connectToDatabase();

  try {
    const updated = await Category.findByIdAndUpdate(
      id,
      {
        name: formData.name.trim(),
        slug: formData.slug.toLowerCase().trim(),
        image: formData.image || '',
        iconName: formData.iconName || 'Package',
      },
      { new: true }
    );
    
    if (!updated) {
      return { success: false, error: 'Category not found.' };
    }

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating category:', error);
    return { success: false, error: error.message || 'Failed to update category.' };
  }
}

/**
 * Admin action to delete a category (if it has no active products).
 */
export async function deleteCategory(id: string) {
  await requireRole('admin');
  await connectToDatabase();

  try {
    // Guard: ensure no products are mapped to this category
    const productsCount = await Product.countDocuments({ category: id });
    if (productsCount > 0) {
      return { 
        success: false, 
        error: `Cannot delete category: contains ${productsCount} active products. Re-assign them first.` 
      };
    }

    const deleted = await Category.findByIdAndDelete(id);
    if (!deleted) {
      return { success: false, error: 'Category not found.' };
    }

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return { success: false, error: error.message || 'Failed to delete category.' };
  }
}
