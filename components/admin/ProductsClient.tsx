'use client';

import React, { useState, useTransition } from 'react';
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  Star, 
  Sparkles,
  Layers,
  ShoppingBag,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { toast } from 'sonner';

import { createProduct, updateProduct, deleteProduct } from '@/app/actions/products';
import { createCategory, updateCategory, deleteCategory } from '@/app/actions/categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { formatKES } from '@/lib/utils';

interface CategoryItem {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  iconName?: string;
}

interface ProductItem {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: CategoryItem | string;
  images: string[];
  stock: number;
  sold: number;
  featured: boolean;
  rating: number;
  reviewsCount: number;
}

interface ProductsClientProps {
  initialProducts: ProductItem[];
  initialCategories: CategoryItem[];
}

export function ProductsClient({ initialProducts, initialCategories }: ProductsClientProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'categories'>('products');
  const [isPending, startTransition] = useTransition();

  // Dialog & CRUD state
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Search & Filter state
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Form states - Product
  const [pName, setPName] = useState('');
  const [pSlug, setPSlug] = useState('');
  const [pDescription, setPDescription] = useState('');
  const [pPrice, setPPrice] = useState('');
  const [pOriginalPrice, setPOriginalPrice] = useState('');
  const [pCategory, setPCategory] = useState('');
  const [pStock, setPStock] = useState('');
  const [pFeatured, setPFeatured] = useState(false);
  const [pImages, setPImages] = useState('');

  // Form states - Category
  const [cName, setCName] = useState('');
  const [cSlug, setCSlug] = useState('');
  const [cIcon, setCIcon] = useState('Package');
  const [cImage, setCImage] = useState('');

  // Auto-slug generator utility
  const handleNameChange = (name: string, type: 'product' | 'category') => {
    const slugified = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // remove non-word chars
      .replace(/[\s_-]+/g, '-') // replace spaces/underscores with hyphens
      .replace(/^-+|-+$/g, ''); // trim hyphens

    if (type === 'product') {
      setPName(name);
      setPSlug(slugified);
    } else {
      setCName(name);
      setCSlug(slugified);
    }
  };

  // Open Dialogs
  const openAddProduct = () => {
    setEditingProduct(null);
    setPName('');
    setPSlug('');
    setPDescription('');
    setPPrice('');
    setPOriginalPrice('');
    setPCategory(initialCategories[0]?._id || '');
    setPStock('10');
    setPFeatured(false);
    setPImages('');
    setIsProductDialogOpen(true);
  };

  const openEditProduct = (product: ProductItem) => {
    setEditingProduct(product);
    setPName(product.name);
    setPSlug(product.slug);
    setPDescription(product.description);
    setPPrice(product.price.toString());
    setPOriginalPrice(product.originalPrice?.toString() || '');
    const catId = typeof product.category === 'object' ? product.category._id : product.category;
    setPCategory(catId);
    setPStock(product.stock.toString());
    setPFeatured(product.featured);
    setPImages(product.images.join(', '));
    setIsProductDialogOpen(true);
  };

  const openAddCategory = () => {
    setEditingCategory(null);
    setCName('');
    setCSlug('');
    setCIcon('Package');
    setCImage('');
    setIsCategoryDialogOpen(true);
  };

  const openEditCategory = (category: CategoryItem) => {
    setEditingCategory(category);
    setCName(category.name);
    setCSlug(category.slug);
    setCIcon(category.iconName || 'Package');
    setCImage(category.image || '');
    setIsCategoryDialogOpen(true);
  };

  // Submit Product CRUD
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!pName || !pSlug || !pDescription || !pPrice || !pCategory || !pStock) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const imgArray = pImages
      .split(',')
      .map((url) => url.trim())
      .filter((url) => url !== '');

    const productPayload = {
      name: pName,
      slug: pSlug,
      description: pDescription,
      price: parseFloat(pPrice),
      originalPrice: pOriginalPrice ? parseFloat(pOriginalPrice) : undefined,
      category: pCategory,
      stock: parseInt(pStock),
      featured: pFeatured,
      images: imgArray,
    };

    startTransition(async () => {
      let response;
      if (editingProduct) {
        response = await updateProduct(editingProduct._id, productPayload);
      } else {
        response = await createProduct(productPayload);
      }

      if (response.success) {
        toast.success(editingProduct ? 'Product updated successfully!' : 'Product created successfully!');
        setIsProductDialogOpen(false);
        // Direct full reload or routing update triggers in the background
        window.location.reload();
      } else {
        toast.error(response.error || 'Failed to submit product.');
      }
    });
  };

  // Submit Category CRUD
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!cName || !cSlug) {
      toast.error('Please fill in all required fields.');
      return;
    }

    const categoryPayload = {
      name: cName,
      slug: cSlug,
      iconName: cIcon,
      image: cImage,
    };

    startTransition(async () => {
      let response;
      if (editingCategory) {
        response = await updateCategory(editingCategory._id, categoryPayload);
      } else {
        response = await createCategory(categoryPayload);
      }

      if (response.success) {
        toast.success(editingCategory ? 'Category updated successfully!' : 'Category created successfully!');
        setIsCategoryDialogOpen(false);
        window.location.reload();
      } else {
        toast.error(response.error || 'Failed to submit category.');
      }
    });
  };

  // Delete Handlers
  const handleDeleteProduct = (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    startTransition(async () => {
      const response = await deleteProduct(id);
      if (response.success) {
        toast.success('Product deleted successfully.');
        window.location.reload();
      } else {
        toast.error(response.error || 'Failed to delete product.');
      }
    });
  };

  const handleDeleteCategory = (id: string) => {
    if (!confirm('Are you sure you want to delete this category? All associated products must be cleared first.')) return;

    startTransition(async () => {
      const response = await deleteCategory(id);
      if (response.success) {
        toast.success('Category deleted successfully.');
        window.location.reload();
      } else {
        toast.error(response.error || 'Failed to delete category.');
      }
    });
  };

  // Filter products
  const filteredProducts = initialProducts.filter((product) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      product.description.toLowerCase().includes(productSearch.toLowerCase());
    
    const catId = typeof product.category === 'object' ? product.category._id : product.category;
    const matchesCategory = categoryFilter === 'all' || catId === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Header and Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Inventory Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage your store's categories, product listings, pricing, and stock levels.
          </p>
        </div>

        {/* Tab switcher buttons */}
        <div className="flex items-center bg-card border border-border p-1 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'products' 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Products</span>
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'categories' 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Categories</span>
          </button>
        </div>
      </div>

      {/* Tab 1: Products Listing Manager */}
      {activeTab === 'products' && (
        <Card className="border-border/50 bg-card/45 backdrop-blur-xs">
          <CardHeader className="border-b border-border/50 pb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="pl-9 bg-background/50"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="appearance-none bg-background border border-border rounded-xl text-xs font-medium px-4 pr-9 py-2.5 focus:outline-none focus:ring-2 focus:ring-ring select-none text-foreground cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  {initialCategories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              </div>

              <Button onClick={openAddProduct} className="gap-1.5 cursor-pointer">
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6 overflow-x-auto">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <ShoppingBag className="h-12 w-12 mx-auto mb-3 opacity-25" />
                <p className="text-sm">No products found. Start by listing a new product!</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-border/60 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                    <th className="pb-3 pl-2">Product Info</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Price</th>
                    <th className="pb-3">Stock & Sold</th>
                    <th className="pb-3">Tags</th>
                    <th className="pb-3 pr-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredProducts.map((product) => {
                    const categoryName = typeof product.category === 'object' ? product.category.name : 'Unassigned';
                    
                    return (
                      <tr key={product._id} className="hover:bg-secondary/20 transition-colors group">
                        {/* Info */}
                        <td className="py-4 pl-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-secondary border border-border overflow-hidden flex-shrink-0 flex items-center justify-center">
                              {product.images[0] ? (
                                <img 
                                  src={product.images[0]} 
                                  alt={product.name} 
                                  className="w-full h-full object-cover" 
                                />
                              ) : (
                                <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-foreground">{product.name}</div>
                              <div className="text-xs text-muted-foreground font-mono truncate max-w-[200px]">
                                {product.slug}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        {/* Category */}
                        <td className="py-4 font-medium text-foreground">
                          {categoryName}
                        </td>

                        {/* Price */}
                        <td className="py-4">
                          <div className="font-semibold text-foreground">
                            {formatKES(product.price)}
                          </div>
                          {product.originalPrice && (
                            <div className="text-xs text-muted-foreground line-through">
                              {formatKES(product.originalPrice)}
                            </div>
                          )}
                        </td>

                        {/* Stock & Sold */}
                        <td className="py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center justify-between text-xs max-w-[130px]">
                              <span>Stock: <b>{product.stock}</b></span>
                              <span className="text-muted-foreground">Sold: {product.sold}</span>
                            </div>
                            <div className="w-32 bg-secondary rounded-full h-1.5 overflow-hidden border border-border/60">
                              <div 
                                className="bg-primary h-full rounded-full" 
                                style={{ width: `${Math.min(100, (product.sold / (product.stock + product.sold || 1)) * 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Tags */}
                        <td className="py-4">
                          {product.featured ? (
                            <Badge variant="default" className="gap-1 bg-amber-500/10 text-amber-500 hover:bg-amber-500/10 border-transparent">
                              <Star className="h-3 w-3 fill-amber-500" />
                              <span>Featured</span>
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 pr-2 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => openEditProduct(product)}
                              className="h-8 w-8 rounded-lg cursor-pointer"
                              title="Edit product"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDeleteProduct(product._id)}
                              className="h-8 w-8 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                              title="Delete product"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Categories Listing Manager */}
      {activeTab === 'categories' && (
        <Card className="border-border/50 bg-card/45 backdrop-blur-xs">
          <CardHeader className="border-b border-border/50 pb-4 flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">All Categories</CardTitle>
              <CardDescription>Configure categories for storefront layouts</CardDescription>
            </div>
            <Button onClick={openAddCategory} className="gap-1.5 cursor-pointer">
              <Plus className="h-4 w-4" />
              <span>Add Category</span>
            </Button>
          </CardHeader>
          <CardContent className="pt-6">
            {initialCategories.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Layers className="h-12 w-12 mx-auto mb-3 opacity-25" />
                <p className="text-sm">No categories registered yet. Click 'Add Category' to start.</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {initialCategories.map((c) => (
                  <Card key={c._id} className="border-border bg-card/90 overflow-hidden flex flex-col justify-between group">
                    <div className="p-4 flex items-start justify-between">
                      <div className="space-y-1">
                        <Badge variant="outline" className="font-mono text-[10px] border-border">{c.slug}</Badge>
                        <h4 className="font-bold text-base text-foreground mt-1.5">{c.name}</h4>
                        <p className="text-xs text-muted-foreground">Icon: <code className="font-mono text-primary">{c.iconName || 'Package'}</code></p>
                      </div>
                      
                      {/* Icon Indicator box */}
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                        <Layers className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="p-3 bg-secondary/35 border-t border-border flex items-center justify-between">
                      <div className="text-[10px] text-muted-foreground">ID: {c._id.slice(-6)}</div>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => openEditCategory(c)}
                          className="h-7 w-7 rounded-md cursor-pointer"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDeleteCategory(c._id)}
                          className="h-7 w-7 rounded-md text-destructive hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* dialog forms implementation */}
      
      {/* 1. PRODUCT DIALOG MODAL */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-lg admin-theme border-border bg-card text-foreground">
          <form onSubmit={handleProductSubmit}>
            <DialogHeader className="pb-4">
              <DialogTitle>{editingProduct ? 'Edit Store Product' : 'Add New Product'}</DialogTitle>
              <DialogDescription>
                Fill in the details below. Custom slug is auto-generated but can be overridden.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {/* Product Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Product Name *</label>
                <Input
                  required
                  placeholder="e.g., Premium Leather Jacket"
                  value={pName}
                  onChange={(e) => handleNameChange(e.target.value, 'product')}
                  disabled={isPending}
                />
              </div>

              {/* Slug */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">URL Slug *</label>
                <Input
                  required
                  placeholder="e.g., premium-leather-jacket"
                  value={pSlug}
                  onChange={(e) => setPSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  disabled={isPending}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Category Select */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Category *</label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value)}
                    className="w-full bg-background border border-border rounded-xl text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-ring text-foreground cursor-pointer"
                    required
                  >
                    <option value="" disabled>Select category</option>
                    {initialCategories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Stock */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Stock Quantity *</label>
                  <Input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g., 25"
                    value={pStock}
                    onChange={(e) => setPStock(e.target.value)}
                    disabled={isPending}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Price */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Price (KES) *</label>
                  <Input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g., 2999"
                    value={pPrice}
                    onChange={(e) => setPPrice(e.target.value)}
                    disabled={isPending}
                  />
                </div>

                {/* Original Price */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold">Original Price (Strikethrough KES)</label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="e.g., 4500"
                    value={pOriginalPrice}
                    onChange={(e) => setPOriginalPrice(e.target.value)}
                    disabled={isPending}
                  />
                </div>
              </div>

              {/* Product Images */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Product Images (Comma-separated URLs)</label>
                <Input
                  placeholder="/product_jacket.png, /product_shoes.png"
                  value={pImages}
                  onChange={(e) => setPImages(e.target.value)}
                  disabled={isPending}
                />
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Leave blank to fall back to a default placeholder image. You can specify relative assets like `/product_jacket.png`.
                </p>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Product Description *</label>
                <textarea
                  required
                  placeholder="Describe the product features, quality, size, and fit..."
                  value={pDescription}
                  onChange={(e) => setPDescription(e.target.value)}
                  disabled={isPending}
                  rows={3}
                  className="w-full bg-background border border-border rounded-xl text-sm px-3 py-2 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring text-foreground transition-all"
                />
              </div>

              {/* Featured Switch */}
              <div className="flex items-center gap-2 pt-1.5">
                <input
                  type="checkbox"
                  id="pFeatured"
                  checked={pFeatured}
                  onChange={(e) => setPFeatured(e.target.checked)}
                  disabled={isPending}
                  className="w-4 h-4 text-primary bg-background border-border rounded-md focus:ring-ring cursor-pointer"
                />
                <label htmlFor="pFeatured" className="text-sm font-semibold select-none flex items-center gap-1 text-foreground cursor-pointer">
                  <Sparkles className="h-4 w-4 text-amber-500 fill-amber-500/20" />
                  <span>Highlight on homepage (Featured Product)</span>
                </label>
              </div>
            </div>

            <DialogFooter className="border-t border-border pt-4 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsProductDialogOpen(false)}
                disabled={isPending}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="cursor-pointer">
                {isPending ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2. CATEGORY DIALOG MODAL */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="max-w-md admin-theme border-border bg-card text-foreground">
          <form onSubmit={handleCategorySubmit}>
            <DialogHeader className="pb-4">
              <DialogTitle>{editingCategory ? 'Edit Store Category' : 'Add New Category'}</DialogTitle>
              <DialogDescription>
                Define categories for storefront layout listing tabs.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Category Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Category Name *</label>
                <Input
                  required
                  placeholder="e.g., Electronics & Gadgets"
                  value={cName}
                  onChange={(e) => handleNameChange(e.target.value, 'category')}
                  disabled={isPending}
                />
              </div>

              {/* Slug */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">URL Slug *</label>
                <Input
                  required
                  placeholder="e.g., electronics-gadgets"
                  value={cSlug}
                  onChange={(e) => setCSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  disabled={isPending}
                />
              </div>

              {/* Icon Code */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Lucide Icon Identifier</label>
                <Input
                  placeholder="e.g., Laptop, Shirt, Home, Package"
                  value={cIcon}
                  onChange={(e) => setCIcon(e.target.value)}
                  disabled={isPending}
                />
              </div>

              {/* Image URL (Optional) */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Promo Image URL (Optional)</label>
                <Input
                  placeholder="/category_electronics.png"
                  value={cImage}
                  onChange={(e) => setCImage(e.target.value)}
                  disabled={isPending}
                />
              </div>
            </div>

            <DialogFooter className="border-t border-border pt-4 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsCategoryDialogOpen(false)}
                disabled={isPending}
                className="cursor-pointer"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="cursor-pointer">
                {isPending ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}
