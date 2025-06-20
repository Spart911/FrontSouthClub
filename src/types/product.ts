export interface ProductColor {
  name: string;
  color: string;
  mainImage: string;
  secondaryImage: string;
  additionalImages: string[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  designer: string;
  size: string;
  colors: ProductColor[];
  images: string[];
  specifications: {
    [key: string]: string;
  };
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  materials: string[];
  category: string;
  inStock: boolean;
  reviews: Array<{
    author: string;
    text: string;
  }>;
} 