import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService';
import type { Product } from '../types/product';

interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: number;
}

interface CartContextType {
  totalItems: number;
  showCart: boolean;
  setShowCart: (show: boolean) => void;
  getCart: () => CartItem[];
  addToCart: (product: Product, selectedColor: number) => void;
  removeFromCart: (productId: string, selectedColor: number) => void;
  updateQuantity: (productId: string, selectedColor: number, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [totalItems, setTotalItems] = useState(0);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    // Обновляем количество товаров при загрузке
    setTotalItems(cartService.getTotalItems());

    // Слушаем изменения в localStorage
    const handleStorageChange = () => {
      setTotalItems(cartService.getTotalItems());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getCart = () => {
    return cartService.getCart();
  };

  const addToCart = (product: Product, selectedColor: number) => {
    cartService.addToCart(product, selectedColor);
    setTotalItems(cartService.getTotalItems());
  };

  const removeFromCart = (productId: string, selectedColor: number) => {
    cartService.removeFromCart(productId, selectedColor);
    setTotalItems(cartService.getTotalItems());
  };

  const updateQuantity = (productId: string, selectedColor: number, quantity: number) => {
    cartService.updateQuantity(productId, selectedColor, quantity);
    setTotalItems(cartService.getTotalItems());
  };

  const clearCart = () => {
    cartService.clearCart();
    setTotalItems(0);
  };

  return (
    <CartContext.Provider value={{
      totalItems,
      showCart,
      setShowCart,
      getCart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 