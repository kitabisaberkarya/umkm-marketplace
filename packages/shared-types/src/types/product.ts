export type ProductStatus = 'draft' | 'active' | 'inactive';

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  children?: Category[];
}

export interface ProductImage {
  id: string;
  url: string;
  order: number;
}

export interface Product {
  id: string;
  sellerId: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  weightGram: number;
  status: ProductStatus;
  images: ProductImage[];
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListItem
  extends Pick<Product, 'id' | 'name' | 'slug' | 'price' | 'stock' | 'status' | 'averageRating'> {
  thumbnailUrl?: string;
  sellerName: string;
  categoryName: string;
}
