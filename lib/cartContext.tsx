import React, { createContext, useContext, useState } from 'react';
import { TransactionDetails } from '@/app/Types/user.types';

interface CartContextType {
  cart: TransactionDetails[];
  addToCart: (item: TransactionDetails) => void;
  removeFromCart: (serialNo: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<TransactionDetails[]>([]);

  const addToCart = (item: TransactionDetails) => {
    setCart((prev) => [...prev, item]);
  };

  const removeFromCart = (serialNo: number) => {
    setCart((prev) => prev.filter((item) => item.SerialNo !== serialNo));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartCount = () => cart.length;

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}