import type { Product } from '../types/product';

interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: number;
}

class CartService {
  private readonly CART_KEY = 'lumni_cart';

  getCart(): CartItem[] {
    const cart = localStorage.getItem(this.CART_KEY);
    return cart ? JSON.parse(cart) : [];
  }

  addToCart(product: Product, selectedColor: number): void {
    const cart = this.getCart();
    const existingItemIndex = cart.findIndex(
      item => item.product.id === product.id && item.selectedColor === selectedColor
    );

    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push({
        product,
        quantity: 1,
        selectedColor
      });
    }

    localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
  }

  removeFromCart(productId: string, selectedColor: number): void {
    const cart = this.getCart();
    const updatedCart = cart.filter(
      item => !(item.product.id === productId && item.selectedColor === selectedColor)
    );
    localStorage.setItem(this.CART_KEY, JSON.stringify(updatedCart));
  }

  updateQuantity(productId: string, selectedColor: number, quantity: number): void {
    const cart = this.getCart();
    const itemIndex = cart.findIndex(
      item => item.product.id === productId && item.selectedColor === selectedColor
    );

    if (itemIndex !== -1) {
      if (quantity <= 0) {
        cart.splice(itemIndex, 1);
      } else {
        cart[itemIndex].quantity = quantity;
      }
      localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
    }
  }

  getTotalItems(): number {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  clearCart(): void {
    localStorage.removeItem(this.CART_KEY);
  }
}

export const cartService = new CartService(); 