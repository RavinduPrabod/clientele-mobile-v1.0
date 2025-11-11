// app/context/CartContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TransactionDetails, TempCart } from '@/app/Types/user.types';
import { UserStorage } from './userStorage';

interface CartContextType {
  cart: TransactionDetails[];
  tempCart: TempCart[];
  addToCart: (item: TransactionDetails, tempItem: TempCart) => void;
  removeFromCart: (serialNo: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalValue: () => number;
  loadCart: () => Promise<void>;  // Add this
  saveCart: () => Promise<void>;  // Add this
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<TransactionDetails[]>([]);
  const [tempCart, setTempCart] = useState<TempCart[]>([]);

  const addToCart = (item: TransactionDetails, tempItem: TempCart) => {
    setCart(prev => [...prev, item]);
    setTempCart(prev => [...prev, tempItem]);
  };

  const removeFromCart = (seqNo: number) => {
    setCart(prev => prev.filter(item => item.SeqNo !== seqNo));
    setTempCart(prev => prev.filter(item => item.seqNo !== seqNo));
  };

  const clearCart = () => {
    setCart([]);
    setTempCart([]);
  };

  const getTotalItems = () => cart.length;

  const getTotalValue = () => {
    return cart.reduce((sum, item) => sum + item.NetValue, 0);
  };
 
  const loadCart = async () => {
    try {
      const savedTempCart = await UserStorage.getTempCart();
      // You'd also need to load the full cart data if stored separately
      setTempCart(savedTempCart);
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const saveCart = async () => {
    try {
      await UserStorage.saveTempCart(tempCart);
      // Save cart data as well if needed
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        tempCart,
        addToCart,
        removeFromCart,
        clearCart,
        getTotalItems,
        getTotalValue,
        loadCart,
        saveCart,
      }}
    >
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