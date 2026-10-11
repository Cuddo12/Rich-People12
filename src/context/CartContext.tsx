import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductSize, Coupon } from '../types/ecommerce';

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, size: ProductSize, color?: string, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  updateItemVariant: (id: string, newSize: ProductSize, newColor: string) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
  appliedCoupon: Coupon | null;
  couponDiscount: number;
  applyCouponCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('richpeople_cart') || localStorage.getItem('heems_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const saved = localStorage.getItem('richpeople_coupon') || localStorage.getItem('heems_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [couponDiscount, setCouponDiscount] = useState<number>(0);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('richpeople_cart', JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Recalculate coupon discount whenever subtotal changes
  useEffect(() => {
    if (!appliedCoupon) {
      setCouponDiscount(0);
      return;
    }

    if (subtotal < appliedCoupon.minOrderAmount) {
      setCouponDiscount(0);
      setAppliedCoupon(null);
      localStorage.removeItem('heems_coupon');
      return;
    }

    let disc = 0;
    if (appliedCoupon.discountType === 'percentage') {
      disc = Math.round((subtotal * appliedCoupon.discountAmount) / 100);
      if (appliedCoupon.maxDiscountAmount && disc > appliedCoupon.maxDiscountAmount) {
        disc = appliedCoupon.maxDiscountAmount;
      }
    } else {
      disc = appliedCoupon.discountAmount;
    }
    setCouponDiscount(Math.min(disc, subtotal));
  }, [subtotal, appliedCoupon]);

  const addItem = (product: Product, size: ProductSize, color?: string, quantity = 1) => {
    const chosenColor = color || (product.colors && product.colors[0]) || 'Standard';
    const compositeId = `${product.id}-${size}-${chosenColor}`;

    setItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.id === compositeId);
      if (existingIdx > -1) {
        const next = [...prev];
        const newQty = Math.min(next[existingIdx].quantity + quantity, product.stockQuantity);
        next[existingIdx].quantity = newQty;
        return next;
      }

      const newItem: CartItem = {
        id: compositeId,
        productId: product.id,
        name: product.name,
        slug: product.slug,
        image: product.featuredImage || product.images[0],
        size,
        color: chosenColor,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        quantity: Math.min(quantity, product.stockQuantity),
        maxStock: product.stockQuantity,
      };

      return [...prev, newItem];
    });

    setIsCartDrawerOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            return { ...item, quantity: Math.min(nextQty, item.maxStock) };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const updateItemVariant = (id: string, newSize: ProductSize, newColor: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (!target) return prev;
      const newCompositeId = `${target.productId}-${newSize}-${newColor}`;
      return prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            id: newCompositeId,
            size: newSize,
            color: newColor,
          };
        }
        return item;
      });
    });
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    setCouponDiscount(0);
    localStorage.removeItem('richpeople_cart');
    localStorage.removeItem('richpeople_coupon');
    localStorage.removeItem('heems_cart');
    localStorage.removeItem('heems_coupon');
  };

  const applyCouponCode = async (code: string) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (data.valid && data.coupon) {
        setAppliedCoupon(data.coupon);
        setCouponDiscount(data.discount);
        localStorage.setItem('richpeople_coupon', JSON.stringify(data.coupon));
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Invalid coupon' };
      }
    } catch {
      return { success: false, message: 'Failed to apply coupon.' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    localStorage.removeItem('richpeople_coupon');
    localStorage.removeItem('heems_coupon');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        updateItemVariant,
        clearCart,
        subtotal,
        itemCount,
        appliedCoupon,
        couponDiscount,
        applyCouponCode,
        removeCoupon,
        isCartDrawerOpen,
        openCartDrawer: () => setIsCartDrawerOpen(true),
        closeCartDrawer: () => setIsCartDrawerOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
