// app/api/utils/route.js
const GUEST_ID_KEY = 'app_guest_id';
const CART_KEY_PREFIX = 'app_cart_';

/** Return existing guest id or create a new one (stored in localStorage). */
function getOrCreateGuestId() {
  if (typeof window === 'undefined') return 'guest';
  try {
    let id = localStorage.getItem(GUEST_ID_KEY);
    if (!id) {
      id = 'guest_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,8);
      localStorage.setItem(GUEST_ID_KEY, id);
    }
    return id;
  } catch (err) {
    console.error('getOrCreateGuestId error', err);
    return 'guest';
  }
}

/** Build storage key for a given userKey (email/id) or guest id */
function storageKeyFor(userKey) {
  const key = userKey || getOrCreateGuestId();
  return CART_KEY_PREFIX + key;
}

/** read cart for userKey (or guest if not passed) */
export const getCart = (userKey) => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(storageKeyFor(userKey));
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('getCart parse error', err);
    return [];
  }
};

/** save cart for userKey */
export const saveCart = (cart, userKey) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(storageKeyFor(userKey), JSON.stringify(cart || []));
  } catch (err) {
    console.error('saveCart error', err);
  }
};

/** addToCart: same shape as your original but accepts userKey */
export const addToCart = (product, quantity = 1, userKey) => {
  if (typeof window === 'undefined') return [];
  try {
    const cart = getCart(userKey);
    const existing = cart.find((item) => item._id === product._id);

    if (existing) {
      existing.quantity = (existing.quantity || 0) + quantity;
    } else {
      cart.push({
        _id: product._id,
        productName: product.productName,
        price: product.todayPrice || product.price,
        imageUrl: product.imageUrl,
        quantity,
      });
    }

    saveCart(cart, userKey);
    return cart;
  } catch (err) {
    console.error('addToCart error', err);
    return [];
  }
};

/** removeFromCart: accepts userKey and returns updated cart */
export const removeFromCart = (id, userKey) => {
  if (typeof window === 'undefined') return [];
  try {
    const updated = getCart(userKey).filter((item) => item._id !== id);
    saveCart(updated, userKey);
    return updated;
  } catch (err) {
    console.error('removeFromCart error', err);
    return [];
  }
};

/** clearCart: remove current user's cart */
export const clearCart = (userKey) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(storageKeyFor(userKey));
  } catch (err) {
    console.error('clearCart error', err);
  }
};

/** Optional helper: setCart directly for userKey */
export const setCart = (cart, userKey) => {
  saveCart(cart, userKey);
  return cart;
};
