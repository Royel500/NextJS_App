

export const getCart = () => {
  if (typeof window === "undefined") return [];
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart) => {
  if (typeof window === "undefined") return;
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const addToCart = (product, quantity = 1) => {
  const cart = getCart();
  const existing = cart.find((item) => item._id === product._id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      _id: product._id,
      productName: product.productName,
      price: product.todayPrice || product.price,
      imageUrl: product.imageUrl,
      quantity,
    });
  }

  saveCart(cart);
  return cart;
};

export const removeFromCart = (id) => {
  const cart = getCart().filter((item) => item._id !== id);
  saveCart(cart);
  return cart;
};

export const clearCart = () => {
  localStorage.removeItem("cart");
};
