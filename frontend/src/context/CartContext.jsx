import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const CartContext = createContext(null);

const storageKey = "meshabek_cart";

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);

  const addToCart = (product, size, quantity = 1) => {
    if (!size) {
      toast.error("Choose a size first.");
      return;
    }

    setItems((current) => {
      const existing = current.find((item) => item.product === product._id && item.size === size);
      if (existing) {
        return current.map((item) =>
          item.product === product._id && item.size === size ? { ...item, quantity: item.quantity + quantity } : item
        );
      }

      return [
        ...current,
        {
          product: product._id,
          name: product.name,
          price: product.price,
          image: product.images[0],
          size,
          quantity
        }
      ];
    });
    toast.success("Added to cart.");
  };

  const updateQuantity = (product, size, quantity) => {
    setItems((current) =>
      current
        .map((item) => (item.product === product && item.size === size ? { ...item, quantity: Math.max(1, quantity) } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (product, size) => {
    setItems((current) => current.filter((item) => !(item.product === product && item.size === size)));
  };

  const clearCart = () => setItems([]);

  const value = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    return { items, subtotal, count, addToCart, updateQuantity, removeItem, clearCart };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
