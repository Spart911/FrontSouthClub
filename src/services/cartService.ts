
interface Product {
  id: string;
  name: string;
  soon?: boolean;
  color?: string;
  composition?: string;
  print_technology?: string;
  size: number[];
  price: number;
  photos: ProductPhoto[];
  order_number?: number;
}

interface ProductPhoto {
  id: string;
  product_id: string;
  name: string;
  file_path: string;
  priority: number;
}

export interface CartItem {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image?: string;
  photo?: {
    file_path: string;
    priority: number;
  };
}

const CART_STORAGE_KEY = 'cart';

export const cartService = {
  // Get all cart items from localStorage
  getCartItems(): CartItem[] {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  },

  // Add item to cart
  addToCart(product: Product, selectedSize: number): void {
    const cartItems = this.getCartItems();
    const sizeLabel = this.getSizeLabel(selectedSize);
    
    // Check if item with same product ID and size already exists
    const existingItemIndex = cartItems.findIndex(
      item => item.id === product.id && item.size === sizeLabel
    );

    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      cartItems[existingItemIndex].quantity += 1;
    } else {
      // Add new item
      const mainPhoto = product.photos.find(p => p.priority === 0) || product.photos[0];
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        size: sizeLabel,
        price: product.price,
        quantity: 1,
        photo: mainPhoto ? {
          file_path: mainPhoto.file_path,
          priority: mainPhoto.priority
        } : undefined
      };
      cartItems.push(newItem);
    }

    // Save to localStorage
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    
    // Dispatch custom event to notify components
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  },

  // Remove item from cart
  removeFromCart(productId: string, size: string): void {
    const cartItems = this.getCartItems();
    const updatedItems = cartItems.filter(
      item => !(item.id === productId && item.size === size)
    );
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedItems));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  },

  // Update item quantity
  updateQuantity(productId: string, size: string, quantity: number): void {
    const cartItems = this.getCartItems();
    const updatedItems = cartItems.map(item => 
      item.id === productId && item.size === size
        ? { ...item, quantity: Math.max(1, quantity) }
        : item
    );
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedItems));
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  },

  // Clear entire cart
  clearCart(): void {
    localStorage.removeItem(CART_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  },

  // Get cart items count
  getCartItemsCount(): number {
    const cartItems = this.getCartItems();
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  },

  // Get size label from number
  getSizeLabel(size: number): string {
    const sizeLabels = ['XS', 'S', 'M', 'L', 'XL'];
    return sizeLabels[size] || 'Unknown';
  }
};
