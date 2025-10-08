import { useState, useEffect } from 'react';

export interface CartItem {
  productId: string;
  title: string;
  sku: string;
  qty: number;
  uom: string;
  specs?: any;
  imageUrl?: string;
}

const CART_KEY = 'lohakart_inquiry_cart_v1';

export function useInquiryCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
  }, []);

  const saveCart = (items: CartItem[]) => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    setCart(items);
  };

  const addItem = (item: CartItem) => {
    const existing = cart.findIndex(i => i.productId === item.productId);
    if (existing >= 0) {
      const updated = [...cart];
      updated[existing].qty += item.qty;
      saveCart(updated);
    } else {
      saveCart([...cart, item]);
    }
  };

  const updateItem = (productId: string, qty: number) => {
    const updated = cart.map(item =>
      item.productId === productId ? { ...item, qty } : item
    );
    saveCart(updated);
  };

  const removeItem = (productId: string) => {
    saveCart(cart.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    localStorage.removeItem(CART_KEY);
    setCart([]);
  };

  return {
    cart,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    itemCount: cart.length,
    totalQty: cart.reduce((sum, item) => sum + item.qty, 0)
  };
}